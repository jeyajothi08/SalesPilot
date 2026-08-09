import pytest
import uuid
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_get_dashboard_metrics(authorized_client: AsyncClient):
    """
    Ensure the Analytics dashboard returns KPIs
    """
    response = await authorized_client.get("/api/v1/analytics/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert "kpis" in data
    assert "insights" in data
    assert "health_score" in data

@pytest.mark.asyncio
async def test_get_revenue_forecast(authorized_client: AsyncClient):
    """
    Ensure the Forecasting endpoint returns forecasts
    """
    response = await authorized_client.get("/api/v1/analytics/sales/forecast")
    assert response.status_code == 200
    data = response.json()
    assert "forecast" in data

@pytest.mark.asyncio
async def test_get_historical_charting(authorized_client: AsyncClient):
    response = await authorized_client.get("/api/v1/analytics/charting?metric=revenue&days=7")
    assert response.status_code == 200
    data = response.json()
    assert data["metric"] == "revenue"
    assert len(data["data"]) == 7
