from fastapi import Depends, HTTPException, status, Header
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
import jwt
from pydantic import ValidationError
import uuid
from typing import Optional

from app.core.config import settings
from app.database.session import get_db
from app.models.user import User
from app.models.iam import OrganizationUser, Role, Organization

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")


async def get_current_user(
    db: AsyncSession = Depends(get_db), token: str = Depends(oauth2_scheme)
) -> User:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id_str: str = payload.get("sub")
        if user_id_str is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload"
            )
        user_id = uuid.UUID(user_id_str)
    except (jwt.PyJWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


async def get_current_org_id(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
    x_organization_id: Optional[str] = Header(None, alias="X-Organization-Id")
) -> uuid.UUID:
    """
    Ensures the user belongs to the requested organization.
    If no org is provided in header, attempts to find their default/first org.
    """
    if x_organization_id:
        try:
            org_uuid = uuid.UUID(x_organization_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid Organization ID format")
    else:
        # Fallback to the first organization the user belongs to
        result = await db.execute(
            select(OrganizationUser.org_id)
            .where(OrganizationUser.user_id == current_user.id, OrganizationUser.status == 'active')
            .limit(1)
        )
        org_uuid = result.scalars().first()
        if not org_uuid:
            raise HTTPException(status_code=403, detail="User does not belong to any active organization")

    # Validate membership
    result = await db.execute(
        select(OrganizationUser)
        .where(OrganizationUser.user_id == current_user.id, OrganizationUser.org_id == org_uuid, OrganizationUser.status == 'active')
    )
    membership = result.scalars().first()
    if not membership:
        raise HTTPException(status_code=403, detail="User is not a member of the requested organization or membership is inactive")
        
    return org_uuid


class RequirePermission:
    """
    Dependency generator for RBAC.
    Validates that the user holds the required permission within the CURRENT organization context.
    """
    def __init__(self, required_permission: str):
        self.required_permission = required_permission

    async def __call__(
        self,
        current_user: User = Depends(get_current_active_user),
        org_id: uuid.UUID = Depends(get_current_org_id),
        db: AsyncSession = Depends(get_db),
    ):
        result = await db.execute(
            select(Role.permissions)
            .join(OrganizationUser, OrganizationUser.role_id == Role.id)
            .where(OrganizationUser.user_id == current_user.id, OrganizationUser.org_id == org_id)
        )
        permissions = result.scalars().first()

        if permissions and ("super_admin" in permissions or "org_owner" in permissions):
            return current_user

        if not permissions or self.required_permission not in permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Not enough permissions in this organization. Required: {self.required_permission}",
            )
        return current_user

async def get_current_admin(
    current_user: User = Depends(RequirePermission("admin:access")),
) -> User:
    return current_user
