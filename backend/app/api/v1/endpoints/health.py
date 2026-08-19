from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.database.session import get_db

router = APIRouter()


@router.get("", summary="Health Check API", response_model=dict)
@router.get("/", summary="Health Check API", response_model=dict)
async def health_check(db: AsyncSession = Depends(get_db)):
    """
    Verify the API is running and can connect to the Database.
    """
    try:
        # Simple query to verify DB connection
        await db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        db_status = f"disconnected: {str(e)}"

    # In a real scenario, we would also ping Redis here

    return {
        "status": "ok",
        "database": db_status,
        "message": "SalesPilot AI Backend is operating normally.",
    }
