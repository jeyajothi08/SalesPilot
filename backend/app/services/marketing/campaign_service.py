import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc
from fastapi import HTTPException
from app.models.communication import Campaign, CampaignAnalytics
from app.schemas.marketing import CampaignCreate, CampaignUpdate

class CampaignService:
    @staticmethod
    async def create_campaign(db: AsyncSession, org_id: uuid.UUID, campaign_in: CampaignCreate) -> Campaign:
        db_campaign = Campaign(org_id=org_id, **campaign_in.model_dump())
        db.add(db_campaign)
        await db.flush() # flush to get the id
        
        # Initialize Analytics
        analytics = CampaignAnalytics(org_id=org_id, campaign_id=db_campaign.id)
        db.add(analytics)
        
        await db.commit()
        await db.refresh(db_campaign)
        return db_campaign

    @staticmethod
    async def get_campaigns(db: AsyncSession, org_id: uuid.UUID, skip: int = 0, limit: int = 100):
        result = await db.execute(select(Campaign).where(Campaign.org_id == org_id).offset(skip).limit(limit))
        return result.scalars().all()

    @staticmethod
    async def get_campaign(db: AsyncSession, org_id: uuid.UUID, campaign_id: uuid.UUID) -> Campaign:
        result = await db.execute(select(Campaign).where(Campaign.id == campaign_id, Campaign.org_id == org_id))
        campaign = result.scalar_one_or_none()
        if not campaign:
            raise HTTPException(status_code=404, detail="Campaign not found")
        return campaign

    @staticmethod
    async def update_campaign(db: AsyncSession, org_id: uuid.UUID, campaign_id: uuid.UUID, campaign_in: CampaignUpdate) -> Campaign:
        campaign = await CampaignService.get_campaign(db, org_id, campaign_id)
        update_data = campaign_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(campaign, field, value)
        await db.commit()
        await db.refresh(campaign)
        return campaign

    @staticmethod
    async def delete_campaign(db: AsyncSession, org_id: uuid.UUID, campaign_id: uuid.UUID) -> None:
        campaign = await CampaignService.get_campaign(db, org_id, campaign_id)
        await db.delete(campaign)
        await db.commit()

    @staticmethod
    async def get_campaign_analytics(db: AsyncSession, org_id: uuid.UUID, campaign_id: uuid.UUID) -> CampaignAnalytics:
        result = await db.execute(select(CampaignAnalytics).where(CampaignAnalytics.campaign_id == campaign_id, CampaignAnalytics.org_id == org_id))
        analytics = result.scalar_one_or_none()
        if not analytics:
            raise HTTPException(status_code=404, detail="Campaign Analytics not found")
        return analytics
