import uuid
from datetime import datetime, timedelta, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc, func

from app.models.crm import Customer, Deal, Activity, Company, Lead, Task, Meeting
from app.schemas.crm import (
    CustomerCreate, CustomerUpdate, 
    DealCreate, DealUpdate, 
    ActivityCreate,
    CompanyCreate, CompanyUpdate,
    LeadCreate, LeadUpdate, LeadConvertRequest,
    TaskCreate, TaskUpdate,
    MeetingCreate, MeetingUpdate
)
from fastapi import HTTPException, status


class CRMService:

    @staticmethod
    async def create_customer(
        db: AsyncSession, org_id: uuid.UUID, customer_in: CustomerCreate
    ) -> Customer:
        db_customer = Customer(org_id=org_id, **customer_in.model_dump())
        db.add(db_customer)
        await db.commit()
        await db.refresh(db_customer)
        return db_customer

    @staticmethod
    async def seed_initial_data(db: AsyncSession, org_id: uuid.UUID):
        """Seed initial database records for newly created or empty organizations."""
        existing = await db.execute(select(Customer).where(Customer.org_id == org_id).limit(1))
        if existing.scalars().first():
            return

        company = Company(
            org_id=org_id,
            name="Acme Corp",
            industry="Enterprise Software",
            employee_count=250,
            annual_revenue=5000000.0,
        )
        db.add(company)
        await db.flush()

        c1 = Customer(
            org_id=org_id,
            company_id=company.id,
            first_name="Sarah",
            last_name="Jenkins",
            email="sarah.j@acmecorp.com",
            phone="+1 (555) 234-5678",
            job_title="VP of Sales",
            status="active",
            health_score=88,
            lifetime_value=45000.0,
        )
        c2 = Customer(
            org_id=org_id,
            company_id=company.id,
            first_name="David",
            last_name="Miller",
            email="d.miller@technova.io",
            phone="+1 (555) 876-5432",
            job_title="CTO",
            status="lead",
            health_score=62,
            lifetime_value=12000.0,
        )
        c3 = Customer(
            org_id=org_id,
            company_id=company.id,
            first_name="Elena",
            last_name="Rostova",
            email="elena@globaltech.com",
            phone="+1 (555) 345-6789",
            job_title="Head of Procurement",
            status="churn_risk",
            health_score=35,
            lifetime_value=98000.0,
        )
        db.add_all([c1, c2, c3])
        await db.flush()

        d1 = Deal(
            org_id=org_id,
            customer_id=c1.id,
            title="Acme Enterprise License",
            value=75000.0,
            stage="qualified",
            probability=60,
        )
        d2 = Deal(
            org_id=org_id,
            customer_id=c2.id,
            title="TechNova Voice AI Rollout",
            value=120000.0,
            stage="proposal",
            probability=80,
        )
        d3 = Deal(
            org_id=org_id,
            customer_id=c3.id,
            title="GlobalTech Omni-Channel Expansion",
            value=45000.0,
            stage="lead",
            probability=30,
        )
        d4 = Deal(
            org_id=org_id,
            customer_id=c1.id,
            title="Acme Copilot Expansion Contract",
            value=150000.0,
            stage="negotiation",
            probability=90,
        )
        db.add_all([d1, d2, d3, d4])
        await db.commit()

    @staticmethod
    async def get_customers(
        db: AsyncSession, org_id: uuid.UUID, skip: int = 0, limit: int = 100
    ):
        await CRMService.seed_initial_data(db, org_id)
        result = await db.execute(
            select(Customer)
            .where(Customer.org_id == org_id)
            .order_by(desc(Customer.created_at))
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()

    @staticmethod
    async def get_customer(db: AsyncSession, org_id: uuid.UUID, customer_id: uuid.UUID) -> Customer:
        result = await db.execute(select(Customer).where(Customer.id == customer_id, Customer.org_id == org_id))
        customer = result.scalar_one_or_none()
        if not customer:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
        return customer

    @staticmethod
    async def update_customer(db: AsyncSession, org_id: uuid.UUID, customer_id: uuid.UUID, customer_in: CustomerUpdate) -> Customer:
        customer = await CRMService.get_customer(db, org_id, customer_id)
        update_data = customer_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(customer, field, value)
        await db.commit()
        await db.refresh(customer)
        return customer

    @staticmethod
    async def delete_customer(db: AsyncSession, org_id: uuid.UUID, customer_id: uuid.UUID) -> None:
        customer = await CRMService.get_customer(db, org_id, customer_id)
        await db.delete(customer)
        await db.commit()

    @staticmethod
    async def create_deal(
        db: AsyncSession, org_id: uuid.UUID, deal_in: DealCreate
    ) -> Deal:
        db_deal = Deal(org_id=org_id, **deal_in.model_dump())
        db.add(db_deal)
        await db.commit()
        await db.refresh(db_deal)
        return db_deal

    @staticmethod
    async def get_deal(db: AsyncSession, org_id: uuid.UUID, deal_id: uuid.UUID) -> Deal:
        result = await db.execute(select(Deal).where(Deal.id == deal_id, Deal.org_id == org_id))
        deal = result.scalar_one_or_none()
        if not deal:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Deal not found")
        return deal

    @staticmethod
    async def update_deal(db: AsyncSession, org_id: uuid.UUID, deal_id: uuid.UUID, deal_in: DealUpdate) -> Deal:
        deal = await CRMService.get_deal(db, org_id, deal_id)
        
        old_stage = deal.stage
        update_data = deal_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(deal, field, value)
            
        new_stage = deal.stage
        
        # Automation: Stage Change Analytics & Activity Log
        if old_stage != new_stage:
            # Automate probability based on stage
            stage_probs = {"Discovery": 10, "Proposal": 40, "Negotiation": 70, "Won": 100, "Lost": 0}
            if new_stage in stage_probs:
                deal.probability = stage_probs[new_stage]
                
            activity = Activity(
                org_id=org_id,
                customer_id=deal.customer_id,
                activity_type="stage_change",
                title=f"Deal moved to {new_stage}",
                description=f"Deal {deal.title} was moved from {old_stage} to {new_stage}"
            )
            db.add(activity)

        await db.commit()
        await db.refresh(deal)
        return deal

    @staticmethod
    async def delete_deal(db: AsyncSession, org_id: uuid.UUID, deal_id: uuid.UUID) -> None:
        deal = await CRMService.get_deal(db, org_id, deal_id)
        await db.delete(deal)
        await db.commit()

    @staticmethod
    async def get_pipeline(db: AsyncSession, org_id: uuid.UUID):
        await CRMService.seed_initial_data(db, org_id)
        result = await db.execute(
            select(Deal)
            .where(Deal.org_id == org_id)
            .where(Deal.stage.not_in(["Won", "Lost"]))
            .order_by(desc(Deal.created_at))
        )
        return result.scalars().all()

    @staticmethod
    async def log_activity(
        db: AsyncSession,
        org_id: uuid.UUID,
        user_id: uuid.UUID,
        activity_in: ActivityCreate,
    ) -> Activity:
        db_activity = Activity(
            org_id=org_id, user_id=user_id, **activity_in.model_dump()
        )
        db.add(db_activity)
        await db.commit()
        await db.refresh(db_activity)
        return db_activity

    @staticmethod
    async def get_activities(
        db: AsyncSession,
        org_id: uuid.UUID,
        customer_id: uuid.UUID = None,
        skip: int = 0,
        limit: int = 50,
    ):
        """List activities for an org, optionally filtered by customer."""
        query = select(Activity).where(Activity.org_id == org_id)
        if customer_id:
            query = query.where(Activity.customer_id == customer_id)
        result = await db.execute(
            query.order_by(desc(Activity.performed_at)).offset(skip).limit(limit)
        )
        return result.scalars().all()

    @staticmethod
    async def create_company(db: AsyncSession, org_id: uuid.UUID, company_in: CompanyCreate) -> Company:
        db_company = Company(org_id=org_id, **company_in.model_dump())
        db.add(db_company)
        await db.commit()
        await db.refresh(db_company)
        return db_company

    @staticmethod
    async def get_companies(db: AsyncSession, org_id: uuid.UUID, skip: int = 0, limit: int = 100):
        result = await db.execute(select(Company).where(Company.org_id == org_id).offset(skip).limit(limit))
        return result.scalars().all()
        
    @staticmethod
    async def get_company(db: AsyncSession, org_id: uuid.UUID, company_id: uuid.UUID) -> Company:
        result = await db.execute(select(Company).where(Company.id == company_id, Company.org_id == org_id))
        company = result.scalar_one_or_none()
        if not company:
            raise HTTPException(status_code=404, detail="Company not found")
        return company

    @staticmethod
    async def update_company(db: AsyncSession, org_id: uuid.UUID, company_id: uuid.UUID, company_in: CompanyUpdate) -> Company:
        company = await CRMService.get_company(db, org_id, company_id)
        update_data = company_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(company, field, value)
        await db.commit()
        await db.refresh(company)
        return company

    @staticmethod
    async def delete_company(db: AsyncSession, org_id: uuid.UUID, company_id: uuid.UUID) -> None:
        company = await CRMService.get_company(db, org_id, company_id)
        await db.delete(company)
        await db.commit()

    # -----------------------------------------------------------------------------
    # LEADS
    # -----------------------------------------------------------------------------
    @staticmethod
    async def create_lead(db: AsyncSession, org_id: uuid.UUID, lead_in: LeadCreate) -> Lead:
        # Automation: Calculate lead score
        ai_score = 75  # TODO: Replace with real AI scoring via LLMFactory
        db_lead = Lead(org_id=org_id, ai_score=ai_score, **lead_in.model_dump())
        db.add(db_lead)
        await db.flush()  # flush to get the lead ID

        # Automation: Schedule follow-up task
        db_task = Task(
            org_id=org_id,
            lead_id=db_lead.id,
            title="Follow up with new lead",
            description=f"Call or email {db_lead.first_name} {db_lead.last_name}",
            due_date=datetime.now(timezone.utc) + timedelta(days=1),  # FIXED: was utcnow()
            assigned_to=db_lead.owner_id
        )
        db.add(db_task)
        
        await db.commit()
        await db.refresh(db_lead)
        return db_lead

    @staticmethod
    async def get_leads(db: AsyncSession, org_id: uuid.UUID, skip: int = 0, limit: int = 100, status_filter: str = None):
        query = select(Lead).where(Lead.org_id == org_id)
        if status_filter:
            query = query.where(Lead.status == status_filter)
        result = await db.execute(query.offset(skip).limit(limit))
        return result.scalars().all()
        
    @staticmethod
    async def get_lead(db: AsyncSession, org_id: uuid.UUID, lead_id: uuid.UUID) -> Lead:
        result = await db.execute(select(Lead).where(Lead.id == lead_id, Lead.org_id == org_id))
        lead = result.scalar_one_or_none()
        if not lead:
            raise HTTPException(status_code=404, detail="Lead not found")
        return lead

    @staticmethod
    async def update_lead(db: AsyncSession, org_id: uuid.UUID, lead_id: uuid.UUID, lead_in: LeadUpdate) -> Lead:
        lead = await CRMService.get_lead(db, org_id, lead_id)
        update_data = lead_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(lead, field, value)
        await db.commit()
        await db.refresh(lead)
        return lead

    @staticmethod
    async def delete_lead(db: AsyncSession, org_id: uuid.UUID, lead_id: uuid.UUID) -> None:
        lead = await CRMService.get_lead(db, org_id, lead_id)
        await db.delete(lead)
        await db.commit()

    @staticmethod
    async def convert_lead_to_customer(db: AsyncSession, org_id: uuid.UUID, lead_id: uuid.UUID, request: LeadConvertRequest) -> Customer:
        lead = await CRMService.get_lead(db, org_id, lead_id)
        if lead.status == "Converted":
            raise HTTPException(status_code=400, detail="Lead is already converted")
            
        company_id = None
        if request.create_company and lead.company_name:
            company = Company(org_id=org_id, name=lead.company_name)
            db.add(company)
            await db.flush()
            company_id = company.id
            
        customer = Customer(
            org_id=org_id,
            company_id=company_id,
            owner_id=lead.owner_id,
            first_name=lead.first_name,
            last_name=lead.last_name,
            email=lead.email,
            status="Active"
        )
        db.add(customer)
        
        lead.status = "Converted"
        
        await db.commit()
        await db.refresh(customer)
        return customer

    # -----------------------------------------------------------------------------
    # TASKS
    # -----------------------------------------------------------------------------
    @staticmethod
    async def create_task(db: AsyncSession, org_id: uuid.UUID, task_in: TaskCreate) -> Task:
        db_task = Task(org_id=org_id, **task_in.model_dump())
        db.add(db_task)
        await db.commit()
        await db.refresh(db_task)
        return db_task

    @staticmethod
    async def get_tasks(db: AsyncSession, org_id: uuid.UUID, skip: int = 0, limit: int = 100):
        result = await db.execute(select(Task).where(Task.org_id == org_id).offset(skip).limit(limit))
        return result.scalars().all()

    @staticmethod
    async def get_task(db: AsyncSession, org_id: uuid.UUID, task_id: uuid.UUID) -> Task:
        result = await db.execute(select(Task).where(Task.id == task_id, Task.org_id == org_id))
        task = result.scalar_one_or_none()
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        return task

    @staticmethod
    async def update_task(db: AsyncSession, org_id: uuid.UUID, task_id: uuid.UUID, task_in: TaskUpdate) -> Task:
        task = await CRMService.get_task(db, org_id, task_id)
        update_data = task_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(task, field, value)
        await db.commit()
        await db.refresh(task)
        return task

    @staticmethod
    async def delete_task(db: AsyncSession, org_id: uuid.UUID, task_id: uuid.UUID) -> None:
        task = await CRMService.get_task(db, org_id, task_id)
        await db.delete(task)
        await db.commit()

    # -----------------------------------------------------------------------------
    # MEETINGS
    # -----------------------------------------------------------------------------
    @staticmethod
    async def create_meeting(db: AsyncSession, org_id: uuid.UUID, meeting_in: MeetingCreate) -> Meeting:
        db_meeting = Meeting(org_id=org_id, **meeting_in.model_dump())
        db.add(db_meeting)
        await db.commit()
        await db.refresh(db_meeting)
        return db_meeting

    @staticmethod
    async def get_meetings(db: AsyncSession, org_id: uuid.UUID, skip: int = 0, limit: int = 100):
        result = await db.execute(select(Meeting).where(Meeting.org_id == org_id).offset(skip).limit(limit))
        return result.scalars().all()

    @staticmethod
    async def get_meeting(db: AsyncSession, org_id: uuid.UUID, meeting_id: uuid.UUID) -> Meeting:
        result = await db.execute(select(Meeting).where(Meeting.id == meeting_id, Meeting.org_id == org_id))
        meeting = result.scalar_one_or_none()
        if not meeting:
            raise HTTPException(status_code=404, detail="Meeting not found")
        return meeting

    @staticmethod
    async def update_meeting(db: AsyncSession, org_id: uuid.UUID, meeting_id: uuid.UUID, meeting_in: MeetingUpdate) -> Meeting:
        meeting = await CRMService.get_meeting(db, org_id, meeting_id)
        update_data = meeting_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(meeting, field, value)
        await db.commit()
        await db.refresh(meeting)
        return meeting

    @staticmethod
    async def delete_meeting(db: AsyncSession, org_id: uuid.UUID, meeting_id: uuid.UUID) -> None:
        meeting = await CRMService.get_meeting(db, org_id, meeting_id)
        await db.delete(meeting)
        await db.commit()

    # -----------------------------------------------------------------------------
    # DASHBOARD
    # -----------------------------------------------------------------------------
    @staticmethod
    async def get_dashboard_metrics(db: AsyncSession, org_id: uuid.UUID):
        from sqlalchemy import func
        total_customers = await db.scalar(select(func.count(Customer.id)).where(Customer.org_id == org_id))
        total_leads = await db.scalar(select(func.count(Lead.id)).where(Lead.org_id == org_id))
        pipeline_value = await db.scalar(
            select(func.sum(Deal.value))
            .where(Deal.org_id == org_id)
            .where(Deal.stage.not_in(["Won", "Lost"]))
        )
        total_deals = await db.scalar(select(func.count(Deal.id)).where(Deal.org_id == org_id))
        won_deals = await db.scalar(select(func.count(Deal.id)).where(Deal.org_id == org_id, Deal.stage == "Won"))
        win_rate = (won_deals / total_deals) * 100 if total_deals > 0 else 0.0

        recent_leads = await db.execute(select(Lead).where(Lead.org_id == org_id).order_by(desc(Lead.created_at)).limit(5))
        recent_leads = recent_leads.scalars().all()
        
        upcoming_meetings = await db.execute(
            select(Activity)
            .where(Activity.org_id == org_id, Activity.activity_type == "meeting")
            .order_by(desc(Activity.performed_at))
            .limit(5)
        )
        upcoming_meetings = upcoming_meetings.scalars().all()

        return {
            "total_customers": total_customers or 0,
            "total_leads": total_leads or 0,
            "pipeline_value": pipeline_value or 0.0,
            "win_rate": win_rate,
            "recent_leads": recent_leads,
            "upcoming_meetings": upcoming_meetings
        }
