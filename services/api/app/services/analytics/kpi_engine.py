import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import date, timedelta
import random


class KPIEngine:
    """
    Abstraction layer for fetching pre-aggregated metrics.
    In production, this queries the `kpi_metrics` materialized view.
    """

    @staticmethod
    async def get_kpi_aggregate(
        db: AsyncSession, org_id: uuid.UUID, metric_name: str, days: int = 30
    ) -> dict:
        """
        Mocks fetching a KPI and calculating its trend.
        """
        # Mocking data for the frontend charts
        historical_data = []
        base_val = (
            random.uniform(1000, 5000)
            if "revenue" in metric_name
            else random.uniform(10, 100)
        )

        for i in range(days):
            d = date.today() - timedelta(days=days - i)
            # Add some random noise for a realistic chart
            val = base_val + (i * random.uniform(-10, 50))
            historical_data.append({"date": d, "value": round(val, 2)})

        current = historical_data[-1]["value"]
        previous = historical_data[-2]["value"]
        pct_change = ((current - previous) / previous) * 100 if previous else 0

        return {
            "metric_name": metric_name,
            "current_value": current,
            "previous_value": previous,
            "percentage_change": round(pct_change, 2),
            "trend": "up" if pct_change > 0 else "down",
            "historical_data": historical_data,
        }
