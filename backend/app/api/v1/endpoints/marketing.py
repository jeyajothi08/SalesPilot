"""
SalesPilot AI — Marketing Automation API Endpoints

CRITICAL FIX: Removed DUMMY_ORG_ID. All endpoints now use get_current_org_id.
"""
import uuid
from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.models.user import User
from app.api.v1.deps import RequirePermission, get_current_org_id

from app.schemas.marketing import (
    CampaignCreate, CampaignUpdate, CampaignResponse,
    CampaignAnalyticsResponse,
    SocialMediaPostCreate, SocialMediaPostUpdate, SocialMediaPostResponse,
    AIContentRequest, AIContentResponse,
)
from app.services.marketing.campaign_service import CampaignService
from app.services.marketing.social_media_service import SocialMediaService
from app.services.marketing.ai_content_service import AIContentService

router = APIRouter()


# ─────────────────────────────────────────────────────────────────────────────
# CAMPAIGNS
# ─────────────────────────────────────────────────────────────────────────────

@router.post("/campaigns", response_model=CampaignResponse, status_code=status.HTTP_201_CREATED)
async def create_campaign(
    campaign_in: CampaignCreate,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("marketing:write")),
):
    return await CampaignService.create_campaign(db, org_id, campaign_in)


@router.get("/campaigns", response_model=List[CampaignResponse])
async def list_campaigns(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("marketing:read")),
):
    return await CampaignService.get_campaigns(db, org_id, skip, limit)


@router.get("/campaigns/{campaign_id}", response_model=CampaignResponse)
async def get_campaign(
    campaign_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("marketing:read")),
):
    return await CampaignService.get_campaign(db, org_id, campaign_id)


@router.put("/campaigns/{campaign_id}", response_model=CampaignResponse)
async def update_campaign(
    campaign_id: uuid.UUID,
    campaign_in: CampaignUpdate,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("marketing:write")),
):
    return await CampaignService.update_campaign(db, org_id, campaign_id, campaign_in)


@router.delete("/campaigns/{campaign_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_campaign(
    campaign_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("marketing:write")),
):
    await CampaignService.delete_campaign(db, org_id, campaign_id)
    return None


@router.get("/campaigns/{campaign_id}/analytics", response_model=CampaignAnalyticsResponse)
async def get_campaign_analytics(
    campaign_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("marketing:read")),
):
    return await CampaignService.get_campaign_analytics(db, org_id, campaign_id)


# ─────────────────────────────────────────────────────────────────────────────
# SOCIAL MEDIA POSTS
# ─────────────────────────────────────────────────────────────────────────────

@router.post("/social-media", response_model=SocialMediaPostResponse, status_code=status.HTTP_201_CREATED)
async def create_social_media_post(
    post_in: SocialMediaPostCreate,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("marketing:write")),
):
    return await SocialMediaService.create_post(db, org_id, post_in)


@router.get("/social-media", response_model=List[SocialMediaPostResponse])
async def list_social_media_posts(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("marketing:read")),
):
    return await SocialMediaService.get_posts(db, org_id, skip, limit)


@router.get("/social-media/{post_id}", response_model=SocialMediaPostResponse)
async def get_social_media_post(
    post_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("marketing:read")),
):
    return await SocialMediaService.get_post(db, org_id, post_id)


@router.put("/social-media/{post_id}", response_model=SocialMediaPostResponse)
async def update_social_media_post(
    post_id: uuid.UUID,
    post_in: SocialMediaPostUpdate,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("marketing:write")),
):
    return await SocialMediaService.update_post(db, org_id, post_id, post_in)


@router.delete("/social-media/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_social_media_post(
    post_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("marketing:write")),
):
    await SocialMediaService.delete_post(db, org_id, post_id)
    return None


# ─────────────────────────────────────────────────────────────────────────────
# AI CONTENT GENERATION
# ─────────────────────────────────────────────────────────────────────────────

@router.post("/ai/generate-content", response_model=AIContentResponse)
async def generate_marketing_content(
    request: AIContentRequest,
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("marketing:write")),
):
    return await AIContentService.generate_content(request)
