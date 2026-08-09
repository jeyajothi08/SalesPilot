from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
import uuid
from datetime import datetime

# --- CAMPAIGN SCHEMAS ---
class CampaignBase(BaseModel):
    name: str
    channel: str = "email"
    status: str = "draft"
    audience_filters: Optional[Dict[str, Any]] = {}
    scheduled_at: Optional[datetime] = None

class CampaignCreate(CampaignBase):
    pass

class CampaignUpdate(BaseModel):
    name: Optional[str] = None
    channel: Optional[str] = None
    status: Optional[str] = None
    audience_filters: Optional[Dict[str, Any]] = None
    scheduled_at: Optional[datetime] = None

class CampaignResponse(CampaignBase):
    id: uuid.UUID
    org_id: uuid.UUID
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# --- CAMPAIGN ANALYTICS SCHEMAS ---
class CampaignAnalyticsResponse(BaseModel):
    id: uuid.UUID
    org_id: uuid.UUID
    campaign_id: uuid.UUID
    total_sent: str
    total_opened: str
    total_clicked: str
    total_bounced: str
    total_conversions: str
    revenue_attributed: str
    spend: str
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

# --- SOCIAL MEDIA POST SCHEMAS ---
class SocialMediaPostBase(BaseModel):
    platform: str
    caption: Optional[str] = None
    image_url: Optional[str] = None
    hashtags: List[str] = []
    status: str = "draft"
    scheduled_for: Optional[datetime] = None

class SocialMediaPostCreate(SocialMediaPostBase):
    campaign_id: Optional[uuid.UUID] = None

class SocialMediaPostUpdate(BaseModel):
    caption: Optional[str] = None
    image_url: Optional[str] = None
    hashtags: Optional[List[str]] = None
    status: Optional[str] = None
    scheduled_for: Optional[datetime] = None
    published_at: Optional[datetime] = None
    likes_count: Optional[str] = None
    comments_count: Optional[str] = None
    shares_count: Optional[str] = None

class SocialMediaPostResponse(SocialMediaPostBase):
    id: uuid.UUID
    org_id: uuid.UUID
    campaign_id: Optional[uuid.UUID] = None
    published_at: Optional[datetime] = None
    provider_post_id: Optional[str] = None
    likes_count: str
    comments_count: str
    shares_count: str
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

# --- AI CONTENT GENERATION SCHEMAS ---
class AIContentRequest(BaseModel):
    content_type: str # blog, email, ad, social, script
    topic: str
    tone: str = "professional"
    target_audience: Optional[str] = None
    keywords: List[str] = []
    provider: str = "openai" # openai, gemini, claude, deepseek

class AIContentResponse(BaseModel):
    content: str
    metadata: Dict[str, Any] = {}
