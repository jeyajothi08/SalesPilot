from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, List, Dict, Any
import uuid
from datetime import datetime


# --- CUSTOMER SCHEMAS ---
class CustomerBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None
    job_title: Optional[str] = None
    status: Optional[str] = "Active"


class CustomerCreate(CustomerBase):
    company_id: Optional[uuid.UUID] = None
    owner_id: Optional[uuid.UUID] = None


class CustomerUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    job_title: Optional[str] = None
    status: Optional[str] = None


class CustomerResponse(CustomerBase):
    id: uuid.UUID
    org_id: uuid.UUID
    health_score: int
    lifetime_value: float
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- DEAL (PIPELINE) SCHEMAS ---
class DealBase(BaseModel):
    title: str
    value: float
    stage: str = "Discovery"
    probability: int = Field(default=10, ge=0, le=100)
    expected_close_date: Optional[datetime] = None


class DealCreate(DealBase):
    customer_id: uuid.UUID
    owner_id: Optional[uuid.UUID] = None


class DealUpdate(BaseModel):
    title: Optional[str] = None
    value: Optional[float] = None
    stage: Optional[str] = None
    probability: Optional[int] = Field(default=None, ge=0, le=100)
    expected_close_date: Optional[datetime] = None


class DealResponse(DealBase):
    id: uuid.UUID
    org_id: uuid.UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- ACTIVITY TIMELINE SCHEMAS ---
class ActivityBase(BaseModel):
    activity_type: str
    title: str
    description: Optional[str] = None
    metadata_json: Optional[Dict[str, Any]] = Field(default_factory=dict)


class ActivityCreate(ActivityBase):
    customer_id: uuid.UUID


class ActivityResponse(ActivityBase):
    id: uuid.UUID
    user_id: Optional[uuid.UUID] = None
    performed_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- COMPLEX RESPONSES ---
class CustomerProfileResponse(CustomerResponse):
    deals: List[DealResponse] = []
    recent_activities: List[ActivityResponse] = []


# --- COMPANY SCHEMAS ---
class CompanyBase(BaseModel):
    name: str
    industry: Optional[str] = None
    domain: Optional[str] = None


class CompanyCreate(CompanyBase):
    pass


class CompanyUpdate(BaseModel):
    name: Optional[str] = None
    industry: Optional[str] = None
    domain: Optional[str] = None


class CompanyResponse(CompanyBase):
    id: uuid.UUID
    org_id: uuid.UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- LEAD SCHEMAS ---
class LeadBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    company_name: Optional[str] = None
    source: Optional[str] = None
    status: str = "New"


class LeadCreate(LeadBase):
    owner_id: Optional[uuid.UUID] = None


class LeadUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    company_name: Optional[str] = None
    source: Optional[str] = None
    status: Optional[str] = None
    ai_score: Optional[int] = Field(default=None, ge=0, le=100)


class LeadResponse(LeadBase):
    id: uuid.UUID
    org_id: uuid.UUID
    owner_id: Optional[uuid.UUID] = None
    ai_score: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- DASHBOARD SCHEMAS ---
class DashboardMetricsResponse(BaseModel):
    total_customers: int
    total_leads: int
    pipeline_value: float
    win_rate: float
    recent_leads: List[LeadResponse]
    upcoming_meetings: List[ActivityResponse]

# --- TASK SCHEMAS ---
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    priority: str = "Medium"
    status: str = "Pending"
    is_recurring: int = 0

class TaskCreate(TaskBase):
    customer_id: Optional[uuid.UUID] = None
    lead_id: Optional[uuid.UUID] = None
    assigned_to: Optional[uuid.UUID] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    is_recurring: Optional[int] = None
    assigned_to: Optional[uuid.UUID] = None

class TaskResponse(TaskBase):
    id: uuid.UUID
    org_id: uuid.UUID
    customer_id: Optional[uuid.UUID] = None
    lead_id: Optional[uuid.UUID] = None
    assigned_to: Optional[uuid.UUID] = None
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


# --- MEETING SCHEMAS ---
class MeetingBase(BaseModel):
    title: str
    start_time: datetime
    end_time: datetime
    attendees: List[str] = []
    meeting_notes: Optional[str] = None
    ai_summary: Optional[str] = None
    outcome: Optional[str] = None
    follow_up_reminder: Optional[datetime] = None

class MeetingCreate(MeetingBase):
    customer_id: Optional[uuid.UUID] = None
    lead_id: Optional[uuid.UUID] = None
    organizer_id: Optional[uuid.UUID] = None

class MeetingUpdate(BaseModel):
    title: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    attendees: Optional[List[str]] = None
    meeting_notes: Optional[str] = None
    ai_summary: Optional[str] = None
    outcome: Optional[str] = None
    follow_up_reminder: Optional[datetime] = None

class MeetingResponse(MeetingBase):
    id: uuid.UUID
    org_id: uuid.UUID
    customer_id: Optional[uuid.UUID] = None
    lead_id: Optional[uuid.UUID] = None
    organizer_id: Optional[uuid.UUID] = None
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

class LeadConvertRequest(BaseModel):
    create_company: bool = False
