import uuid
from datetime import datetime, timedelta, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.database.session import get_db
from app.schemas.user import UserCreate, UserResponse, Token, SessionResponse, ForgotPasswordRequest, ResetPasswordRequest, UserProfileUpdate
from app.models.user import User
from app.models.iam import Organization, Role, OrganizationUser, Session
from app.core.security import get_password_hash, create_access_token, verify_password
from app.api.v1.deps import get_current_active_user, RequirePermission
import structlog

logger = structlog.get_logger()

router = APIRouter()


@router.post(
    "/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED
)
async def register_user(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    # 0. Validate password strength
    if len(user_in.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")

    # 1. Check if user exists
    result = await db.execute(select(User).where(User.email == user_in.email))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Email already registered")

    # 2. Create User
    new_user = User(
        email=user_in.email,
        password_hash=get_password_hash(user_in.password),
        first_name=user_in.first_name,
        last_name=user_in.last_name,
    )
    db.add(new_user)
    await db.flush()  # flush to get user id

    # 3. Create Organization
    org = Organization(name=user_in.company_name)
    db.add(org)
    await db.flush()

    # 4. Create 'Super Admin' Role for this Org
    admin_role = Role(
        org_id=org.id,
        name="Super Admin",
        permissions=["super_admin"],  # Grants all access in deps.py
    )
    db.add(admin_role)
    await db.flush()

    # 5. Link User to Org and Role
    org_user = OrganizationUser(
        org_id=org.id, user_id=new_user.id, role_id=admin_role.id
    )
    db.add(org_user)

    await db.commit()
    await db.refresh(new_user)
    return new_user


@router.post("/login", response_model=Token)
async def login(
    request: Request, form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)
):
    from app.services.security import AlertService, AuditLogger
    
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalars().first()

    if not user or not verify_password(form_data.password, user.password_hash):
        # Track failed login for brute-force detection
        alert_triggered = AlertService.record_failed_login(form_data.username)
        if alert_triggered:
            logger.warning("brute_force_alert", email=form_data.username, ip=request.client.host if request.client else "unknown")
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    # Clear failed login counter on success
    AlertService.clear_failed_logins(form_data.username)

    # Generate Tokens
    access_token = create_access_token(subject=user.id)
    refresh_token = str(uuid.uuid4())  # Simple refresh token strategy for db storage

    # Record Session (Device Management)
    session = Session(
        user_id=user.id,
        refresh_token=refresh_token,
        device_info=request.headers.get("User-Agent", "Unknown Device"),
        ip_address=request.client.host if request.client else "Unknown IP",
        expires_at=datetime.now(timezone.utc) + timedelta(days=7),  # 7 days refresh
    )
    db.add(session)
    
    # Audit log the login event
    # Find the user's first org for audit context
    from app.models.iam import OrganizationUser as OrgUser
    org_result = await db.execute(
        select(OrgUser.org_id).where(OrgUser.user_id == user.id).limit(1)
    )
    org_id = org_result.scalars().first()
    if org_id:
        await AuditLogger.log(
            db=db,
            org_id=org_id,
            user_id=user.id,
            action="user_login",
            resource_type="session",
            ip_address=request.client.host if request.client else None,
            details={"device": request.headers.get("User-Agent", "Unknown")}
        )
    
    await db.commit()

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


class RefreshRequest(BaseModel):
    refresh_token: str


@router.post("/refresh", response_model=Token)
async def refresh_token(req: RefreshRequest, db: AsyncSession = Depends(get_db)):
    """Issue a new access token using a valid refresh token (token rotation)."""
    result = await db.execute(
        select(Session).where(Session.refresh_token == req.refresh_token)
    )
    session = result.scalars().first()

    # SQLite stores datetimes as naive UTC strings, so compare against naive UTC
    if not session or session.is_revoked or session.expires_at < datetime.utcnow():
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    # Refresh Token Rotation: Issue new tokens, invalidate old session, create new session
    session.is_revoked = True

    new_access_token = create_access_token(subject=session.user_id)
    new_refresh_token = str(uuid.uuid4())

    new_session = Session(
        user_id=session.user_id,
        refresh_token=new_refresh_token,
        device_info=session.device_info,
        ip_address=session.ip_address,
        expires_at=datetime.now(timezone.utc) + timedelta(days=7),
    )

    db.add(new_session)
    await db.commit()

    return {
        "access_token": new_access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer",
    }


class LogoutRequest(BaseModel):
    refresh_token: str


@router.post("/logout")
async def logout(req: LogoutRequest, db: AsyncSession = Depends(get_db)):
    """Revoke the specific device session. Token passed in request body (not URL)."""
    result = await db.execute(
        select(Session).where(Session.refresh_token == req.refresh_token)
    )
    session = result.scalars().first()
    if session:
        session.is_revoked = True
        await db.commit()
    # Always return success to avoid token enumeration
    return {"message": "Successfully logged out of this device."}


@router.get("/sessions", response_model=List[SessionResponse])
async def get_active_sessions(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    # Returns all active devices for the user (Device Management)
    result = await db.execute(
        select(Session)
        .where(Session.user_id == current_user.id)
        .where(Session.is_revoked == False)
        .where(Session.expires_at > datetime.now(timezone.utc))
        .order_by(Session.last_activity.desc())
    )
    return result.scalars().all()


# --- Example of RBAC Protected Endpoint ---
@router.get("/protected-crm-data")
async def get_crm_data(current_user: User = Depends(RequirePermission("crm:read"))):
    """
    This endpoint can only be accessed if the JWT is valid, the user is active,
    and their role contains the 'crm:read' permission.
    """
    return {
        "message": "You have accessed highly sensitive CRM data.",
        "user_id": current_user.id,
    }

@router.post("/forgot-password")
async def forgot_password(req: ForgotPasswordRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == req.email))
    user = result.scalars().first()
    
    if user:
        # In production, send an email with a reset token here.
        # We can generate a short-lived token using JWT.
        reset_token = create_access_token(subject=user.email, expires_delta=timedelta(minutes=15))
        # Send Email via EmailProvider ... (Mocked for now)
        # FIXED: removed print() that leaked reset token to server logs
        # In production, use EmailProvider.send_email() here
        logger.info("password_reset_requested", email=user.email, token_generated=True)
        
    return {"message": "If an account with that email exists, we have sent a password reset link."}

@router.post("/reset-password")
async def reset_password(req: ResetPasswordRequest, db: AsyncSession = Depends(get_db)):
    import jwt
    from app.core.config import settings
    
    try:
        payload = jwt.decode(req.token, settings.SECRET_KEY, algorithms=["HS256"])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=400, detail="Invalid token")
    except jwt.PyJWTError:
        raise HTTPException(status_code=400, detail="Invalid token")

    result = await db.execute(select(User).where(User.email == email))
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    user.password_hash = get_password_hash(req.new_password)
    await db.commit()
    
    return {"message": "Password reset successfully"}

@router.get("/profile", response_model=UserResponse)
@router.get("/me", response_model=UserResponse)
async def get_profile(current_user: User = Depends(get_current_active_user)):
    return current_user

@router.put("/profile", response_model=UserResponse)
async def update_profile(
    req: UserProfileUpdate, 
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    if req.first_name is not None:
        current_user.first_name = req.first_name
    if req.last_name is not None:
        current_user.last_name = req.last_name
    if req.phone_number is not None:
        current_user.phone_number = req.phone_number
    if req.bio is not None:
        current_user.bio = req.bio
        
    await db.commit()
    await db.refresh(current_user)
    return current_user
