"""
SalesPilot AI — Analytics API Endpoints

CRITICAL FIX: Removed hardcoded org_id. All endpoints now use get_current_org_id.
Real DB queries are used where data exists; KPIEngine returns aggregated data.
"""
import uuid
from datetime import date, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, select

from app.database.session import get_db
from app.models.user import User
from app.models.crm import Customer, Lead, Deal, Activity
from app.api.v1.deps import RequirePermission, get_current_org_id
from app.services.analytics.kpi_engine import KPIEngine
from app.services.analytics.forecasting_engine import ForecastingEngine
from app.services.analytics.insight_engine import InsightEngine

router = APIRouter()


@router.get("/dashboard")
async def get_executive_dashboard(
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("analytics:read")),
):
    """Returns the comprehensive data payload for the Executive Dashboard."""
    # 1. Fetch core KPIs from DB aggregations
    total_customers = await db.scalar(
        select(func.count(Customer.id)).where(Customer.org_id == org_id)
    )
    total_leads = await db.scalar(
        select(func.count(Lead.id)).where(Lead.org_id == org_id)
    )
    total_deals = await db.scalar(
        select(func.count(Deal.id)).where(Deal.org_id == org_id)
    )
    pipeline_value = await db.scalar(
        select(func.coalesce(func.sum(Deal.value), 0.0))
        .where(Deal.org_id == org_id, Deal.stage.not_in(["Won", "Lost"]))
    )
    won_deals = await db.scalar(
        select(func.count(Deal.id)).where(Deal.org_id == org_id, Deal.stage == "Won")
    )
    win_rate = round((won_deals / total_deals) * 100, 2) if total_deals else 0.0

    # 2. Trend data from KPI engine (falls back to aggregation)
    revenue_kpi = await KPIEngine.get_kpi_aggregate(db, org_id, "total_revenue")
    leads_kpi = await KPIEngine.get_kpi_aggregate(db, org_id, "new_leads")

    # 3. AI Predictive Insights
    insights = await InsightEngine.get_active_insights(db, org_id)

    return {
        "summary": {
            "total_customers": total_customers or 0,
            "total_leads": total_leads or 0,
            "total_deals": total_deals or 0,
            "pipeline_value": float(pipeline_value or 0),
            "win_rate": win_rate,
        },
        "kpis": {
            "revenue": revenue_kpi,
            "leads": leads_kpi,
        },
        "insights": insights,
    }


@router.get("/sales/forecast")
async def get_sales_forecast(
    days: int = Query(30, ge=7, le=365),
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("analytics:read")),
):
    """AI-powered revenue forecast for the next N days."""
    forecast = await ForecastingEngine.generate_revenue_forecast(org_id, days)
    return {"org_id": str(org_id), "days_ahead": days, "forecast": forecast}


@router.get("/charting")
async def get_historical_charting(
    metric: str = Query(..., description="Metric name: customers_added, leads_added, deals_closed, revenue"),
    days: int = Query(30, ge=7, le=365),
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("analytics:read")),
):
    """Returns real time-series data from the database for charting."""
    data = await KPIEngine.get_kpi_aggregate(db, org_id, metric, days)
    return {"metric": metric, "org_id": str(org_id), **data}


@router.get("/pipeline/funnel")
async def get_pipeline_funnel(
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("analytics:read")),
):
    """Returns deal count and value by pipeline stage for funnel chart."""
    stages = ["Discovery", "Proposal", "Negotiation", "Won", "Lost"]
    funnel = []
    for stage in stages:
        count = await db.scalar(
            select(func.count(Deal.id)).where(Deal.org_id == org_id, Deal.stage == stage)
        )
        value = await db.scalar(
            select(func.coalesce(func.sum(Deal.value), 0.0)).where(
                Deal.org_id == org_id, Deal.stage == stage
            )
        )
        funnel.append({"stage": stage, "deal_count": count or 0, "total_value": float(value or 0)})

    return {"funnel": funnel}


@router.get("/leads/sources")
async def get_lead_sources_breakdown(
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("analytics:read")),
):
    """Returns lead counts grouped by source for pie/donut charts."""
    result = await db.execute(
        select(Lead.source, func.count(Lead.id).label("count"))
        .where(Lead.org_id == org_id)
        .group_by(Lead.source)
        .order_by(func.count(Lead.id).desc())
    )
    rows = result.all()
    return {"sources": [{"source": r.source or "Unknown", "count": r.count} for r in rows]}
