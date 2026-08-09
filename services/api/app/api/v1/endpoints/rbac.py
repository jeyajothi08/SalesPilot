import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.database.session import get_db
from app.models.user import User
from app.models.iam import Role
from app.api.v1.deps import RequirePermission, get_current_org_id
from pydantic import BaseModel, ConfigDict

router = APIRouter()

class RoleCreate(BaseModel):
    name: str
    permissions: List[str]

class RoleResponse(BaseModel):
    id: uuid.UUID
    name: str
    permissions: List[str]
    is_custom: bool
    model_config = ConfigDict(from_attributes=True)

@router.get("/", response_model=List[RoleResponse])
async def get_roles(
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("roles:read"))
):
    result = await db.execute(select(Role).where(Role.org_id == org_id))
    return result.scalars().all()

@router.post("/", response_model=RoleResponse)
async def create_role(
    req: RoleCreate,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("roles:manage"))
):
    role = Role(
        org_id=org_id,
        name=req.name,
        permissions=req.permissions,
        is_custom=True
    )
    db.add(role)
    await db.commit()
    await db.refresh(role)
    return role
