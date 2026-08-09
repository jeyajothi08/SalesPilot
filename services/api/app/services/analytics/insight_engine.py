import uuid
from sqlalchemy.ext.asyncio import AsyncSession


class InsightEngine:
    """
    Periodically queries KPIs to detect anomalies and generates natural language insights via LLM.
    """

    @staticmethod
    async def get_active_insights(db: AsyncSession, org_id: uuid.UUID) -> list:
        """
        Mocks fetching active insights for the dashboard.
        """
        return [
            {
                "id": uuid.uuid4(),
                "insight_type": "revenue_risk",
                "title": "Declining Sales in Q3",
                "description": "Enterprise software sales have dropped 14% this month. Recommend running a re-engagement campaign.",
                "confidence_score": 0.89,
                "created_at": "2026-07-17T12:00:00Z",
            }
        ]
