import uuid
from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.database.session import get_db
from app.models.user import User
from app.models.iam import OrganizationUser, Role, Department, Team, Invitation
from app.api.v1.deps import RequirePermission, get_current_org_id
from pydantic import BaseModel, ConfigDict
from datetime import datetime, timedelta

router = APIRouter()

class InviteRequest(BaseModel):
    email: str
    role_id: uuid.UUID

@router.get("/members")
async def get_team_members(
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("users:read"))
):
    result = await db.execute(
        select(OrganizationUser, User, Role)
        .join(User, User.id == OrganizationUser.user_id)
        .outerjoin(Role, Role.id == OrganizationUser.role_id)
        .where(OrganizationUser.org_id == org_id)
    )
    members = result.all()
    
    return [
        {
            "user_id": org_user.user_id,
            "status": org_user.status,
            "joined_at": org_user.joined_at,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": role.name if role else None,
            "department_id": org_user.department_id,
            "team_id": org_user.team_id
        }
        for org_user, user, role in members
    ]

@router.post("/invite")
async def invite_member(
    req: InviteRequest,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("users:manage"))
):
    # Mocking token generation for invite
    token = uuid.uuid4().hex
    invitation = Invitation(
        org_id=org_id,
        email=req.email,
        role_id=req.role_id,
        invited_by=current_user.id,
        token=token,
        expires_at=datetime.utcnow() + timedelta(days=7)
    )
    db.add(invitation)
    await db.commit()
    # E.g. background_tasks.add_task(send_invite_email, req.email, token)
    return {"status": "invited", "token": token}
