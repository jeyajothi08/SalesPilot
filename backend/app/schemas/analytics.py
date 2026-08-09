from pydantic import BaseModel
from typing import List, Dict, Any
import uuid
from datetime import datetime, date


class MetricResponse(BaseModel):
    date: date
    value: float


class KPIAggregateResponse(BaseModel):
    metric_name: str
    current_value: float
    previous_value: float
    percentage_change: float
    trend: str  # "up", "down", "flat"
    historical_data: List[MetricResponse] = []


class AIInsightResponse(BaseModel):
    id: uuid.UUID
    insight_type: str
    title: str
    description: str
    confidence_score: float
    created_at: datetime

    class Config:
        from_attributes = True


class DashboardConfigResponse(BaseModel):
    id: uuid.UUID
    widget_type: str
    data_source: str
    layout_config: Dict[str, Any]

    class Config:
        from_attributes = True
