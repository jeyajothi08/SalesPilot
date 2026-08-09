import uuid
from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.database.session import get_db
from app.models.user import User
from app.models.iam import Organization
from app.api.v1.deps import RequirePermission, get_current_org_id
from pydantic import BaseModel, ConfigDict

router = APIRouter()

class OrganizationUpdate(BaseModel):
    name: str | None = None
    logo_url: str | None = None
    timezone: str | None = None
    currency: str | None = None
    language: str | None = None
    business_settings: dict | None = None

class OrganizationResponse(BaseModel):
    id: uuid.UUID
    name: str
    domain: str | None
    logo_url: str | None
    timezone: str
    currency: str
    language: str
    business_settings: dict
    model_config = ConfigDict(from_attributes=True)

@router.get("/current", response_model=OrganizationResponse)
async def get_current_organization(
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("org:read"))
):
    result = await db.execute(select(Organization).where(Organization.id == org_id))
    org = result.scalars().first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    return org

@router.put("/current", response_model=OrganizationResponse)
async def update_current_organization(
    update_data: OrganizationUpdate,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("org:write"))
):
    result = await db.execute(select(Organization).where(Organization.id == org_id))
    org = result.scalars().first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
        
    for field, value in update_data.model_dump(exclude_unset=True).items():
        setattr(org, field, value)
        
    await db.commit()
    await db.refresh(org)
    
    # In a real app we'd log this to AuditLog
    
    return org
