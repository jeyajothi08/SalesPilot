"""
SalesPilot AI — CRM API Endpoints

CRITICAL FIX: Removed hardcoded DUMMY_ORG_ID.
All endpoints now use get_current_org_id dependency for proper multi-tenancy.
"""
import uuid
from typing import List
from fastapi import APIRouter, Depends, status, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.models.user import User
from app.api.v1.deps import RequirePermission, get_current_org_id
from app.schemas.crm import (
    CustomerCreate, CustomerUpdate, CustomerResponse,
    DealCreate, DealUpdate, DealResponse,
    ActivityCreate, ActivityResponse,
    CompanyCreate, CompanyUpdate, CompanyResponse,
    LeadCreate, LeadUpdate, LeadResponse, LeadConvertRequest,
    TaskCreate, TaskUpdate, TaskResponse,
    MeetingCreate, MeetingUpdate, MeetingResponse,
    DashboardMetricsResponse,
)
from app.services.crm_service import CRMService

router = APIRouter()


# ─────────────────────────────────────────────────────────────────────────────
# CUSTOMERS
# ─────────────────────────────────────────────────────────────────────────────

@router.post("/customers", response_model=CustomerResponse, status_code=status.HTTP_201_CREATED)
async def create_customer(
    customer_in: CustomerCreate,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("crm:write")),
):
    return await CRMService.create_customer(db, org_id, customer_in)


@router.get("/customers", response_model=List[CustomerResponse])
async def list_customers(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("crm:read")),
):
    return await CRMService.get_customers(db, org_id, skip, limit)


@router.get("/customers/{customer_id}", response_model=CustomerResponse)
async def get_customer(
    customer_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("crm:read")),
):
    return await CRMService.get_customer(db, org_id, customer_id)


@router.put("/customers/{customer_id}", response_model=CustomerResponse)
async def update_customer(
    customer_id: uuid.UUID,
    customer_in: CustomerUpdate,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("crm:write")),
):
    return await CRMService.update_customer(db, org_id, customer_id, customer_in)


@router.delete("/customers/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_customer(
    customer_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("crm:write")),
):
    await CRMService.delete_customer(db, org_id, customer_id)
    return None


# ─────────────────────────────────────────────────────────────────────────────
# PIPELINE (DEALS)
# ─────────────────────────────────────────────────────────────────────────────

@router.post("/deals", response_model=DealResponse, status_code=status.HTTP_201_CREATED)
async def create_deal(
    deal_in: DealCreate,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("crm:write")),
):
    return await CRMService.create_deal(db, org_id, deal_in)


@router.get("/deals/pipeline", response_model=List[DealResponse])
async def get_pipeline(
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("crm:read")),
):
    return await CRMService.get_pipeline(db, org_id)


@router.get("/deals/{deal_id}", response_model=DealResponse)
async def get_deal(
    deal_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("crm:read")),
):
    return await CRMService.get_deal(db, org_id, deal_id)


@router.put("/deals/{deal_id}", response_model=DealResponse)
async def update_deal(
    deal_id: uuid.UUID,
    deal_in: DealUpdate,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("crm:write")),
):
    return await CRMService.update_deal(db, org_id, deal_id, deal_in)


@router.delete("/deals/{deal_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_deal(
    deal_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("crm:write")),
):
    await CRMService.delete_deal(db, org_id, deal_id)
    return None


# ─────────────────────────────────────────────────────────────────────────────
# ACTIVITY TIMELINE
# ─────────────────────────────────────────────────────────────────────────────

@router.post("/activities", response_model=ActivityResponse, status_code=status.HTTP_201_CREATED)
async def log_activity(
    activity_in: ActivityCreate,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("crm:write")),
):
    return await CRMService.log_activity(db, org_id, current_user.id, activity_in)


@router.get("/activities", response_model=List[ActivityResponse])
async def list_activities(
    customer_id: uuid.UUID = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("crm:read")),
):
    return await CRMService.get_activities(db, org_id, customer_id=customer_id, skip=skip, limit=limit)


# ─────────────────────────────────────────────────────────────────────────────
# COMPANIES
# ─────────────────────────────────────────────────────────────────────────────

@router.post("/companies", response_model=CompanyResponse, status_code=status.HTTP_201_CREATED)
async def create_company(
    company_in: CompanyCreate,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("crm:write")),
):
    return await CRMService.create_company(db, org_id, company_in)


@router.get("/companies", response_model=List[CompanyResponse])
async def list_companies(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("crm:read")),
):
    return await CRMService.get_companies(db, org_id, skip, limit)


@router.get("/companies/{company_id}", response_model=CompanyResponse)
async def get_company(
    company_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("crm:read")),
):
    return await CRMService.get_company(db, org_id, company_id)


@router.put("/companies/{company_id}", response_model=CompanyResponse)
async def update_company(
    company_id: uuid.UUID,
    company_in: CompanyUpdate,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("crm:write")),
):
    return await CRMService.update_company(db, org_id, company_id, company_in)


@router.delete("/companies/{company_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_company(
    company_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("crm:write")),
):
    await CRMService.delete_company(db, org_id, company_id)
    return None


# ─────────────────────────────────────────────────────────────────────────────
# LEADS
# ─────────────────────────────────────────────────────────────────────────────

@router.post("/leads", response_model=LeadResponse, status_code=status.HTTP_201_CREATED)
async def create_lead(
    lead_in: LeadCreate,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("crm:write")),
):
    return await CRMService.create_lead(db, org_id, lead_in)


@router.get("/leads", response_model=List[LeadResponse])
async def list_leads(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    status: str = None,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("crm:read")),
):
    return await CRMService.get_leads(db, org_id, skip, limit, status_filter=status)


@router.get("/leads/{lead_id}", response_model=LeadResponse)
async def get_lead(
    lead_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("crm:read")),
):
    return await CRMService.get_lead(db, org_id, lead_id)


@router.put("/leads/{lead_id}", response_model=LeadResponse)
async def update_lead(
    lead_id: uuid.UUID,
    lead_in: LeadUpdate,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("crm:write")),
):
    return await CRMService.update_lead(db, org_id, lead_id, lead_in)


@router.delete("/leads/{lead_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_lead(
    lead_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("crm:write")),
):
    await CRMService.delete_lead(db, org_id, lead_id)
    return None


@router.post("/leads/{lead_id}/convert", response_model=CustomerResponse)
async def convert_lead(
    lead_id: uuid.UUID,
    request: LeadConvertRequest,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("crm:write")),
):
    return await CRMService.convert_lead_to_customer(db, org_id, lead_id, request)


# ─────────────────────────────────────────────────────────────────────────────
# TASKS
# ─────────────────────────────────────────────────────────────────────────────

@router.post("/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_in: TaskCreate,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("crm:write")),
):
    return await CRMService.create_task(db, org_id, task_in)


@router.get("/tasks", response_model=List[TaskResponse])
async def list_tasks(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("crm:read")),
):
    return await CRMService.get_tasks(db, org_id, skip, limit)


@router.get("/tasks/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("crm:read")),
):
    return await CRMService.get_task(db, org_id, task_id)


@router.put("/tasks/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: uuid.UUID,
    task_in: TaskUpdate,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("crm:write")),
):
    return await CRMService.update_task(db, org_id, task_id, task_in)


@router.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("crm:write")),
):
    await CRMService.delete_task(db, org_id, task_id)
    return None


# ─────────────────────────────────────────────────────────────────────────────
# MEETINGS
# ─────────────────────────────────────────────────────────────────────────────

@router.post("/meetings", response_model=MeetingResponse, status_code=status.HTTP_201_CREATED)
async def create_meeting(
    meeting_in: MeetingCreate,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("crm:write")),
):
    return await CRMService.create_meeting(db, org_id, meeting_in)


@router.get("/meetings", response_model=List[MeetingResponse])
async def list_meetings(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("crm:read")),
):
    return await CRMService.get_meetings(db, org_id, skip, limit)


@router.get("/meetings/{meeting_id}", response_model=MeetingResponse)
async def get_meeting(
    meeting_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("crm:read")),
):
    return await CRMService.get_meeting(db, org_id, meeting_id)


@router.put("/meetings/{meeting_id}", response_model=MeetingResponse)
async def update_meeting(
    meeting_id: uuid.UUID,
    meeting_in: MeetingUpdate,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("crm:write")),
):
    return await CRMService.update_meeting(db, org_id, meeting_id, meeting_in)


@router.delete("/meetings/{meeting_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_meeting(
    meeting_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("crm:write")),
):
    await CRMService.delete_meeting(db, org_id, meeting_id)
    return None


# ─────────────────────────────────────────────────────────────────────────────
# DASHBOARD
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/dashboard", response_model=DashboardMetricsResponse)
async def get_dashboard(
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("crm:read")),
):
    return await CRMService.get_dashboard_metrics(db, org_id)
