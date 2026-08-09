import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException
from app.models.communication import SocialMediaPost
from app.schemas.marketing import SocialMediaPostCreate, SocialMediaPostUpdate

class SocialMediaService:
    @staticmethod
    async def create_post(db: AsyncSession, org_id: uuid.UUID, post_in: SocialMediaPostCreate) -> SocialMediaPost:
        db_post = SocialMediaPost(org_id=org_id, **post_in.model_dump())
        db.add(db_post)
        await db.commit()
        await db.refresh(db_post)
        return db_post

    @staticmethod
    async def get_posts(db: AsyncSession, org_id: uuid.UUID, skip: int = 0, limit: int = 100):
        result = await db.execute(select(SocialMediaPost).where(SocialMediaPost.org_id == org_id).offset(skip).limit(limit))
        return result.scalars().all()

    @staticmethod
    async def get_post(db: AsyncSession, org_id: uuid.UUID, post_id: uuid.UUID) -> SocialMediaPost:
        result = await db.execute(select(SocialMediaPost).where(SocialMediaPost.id == post_id, SocialMediaPost.org_id == org_id))
        post = result.scalar_one_or_none()
        if not post:
            raise HTTPException(status_code=404, detail="Social Media Post not found")
        return post

    @staticmethod
    async def update_post(db: AsyncSession, org_id: uuid.UUID, post_id: uuid.UUID, post_in: SocialMediaPostUpdate) -> SocialMediaPost:
        post = await SocialMediaService.get_post(db, org_id, post_id)
        update_data = post_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(post, field, value)
        await db.commit()
        await db.refresh(post)
        return post

    @staticmethod
    async def delete_post(db: AsyncSession, org_id: uuid.UUID, post_id: uuid.UUID) -> None:
        post = await SocialMediaService.get_post(db, org_id, post_id)
        await db.delete(post)
        await db.commit()
