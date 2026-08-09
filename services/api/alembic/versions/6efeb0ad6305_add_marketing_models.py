"""add marketing models

Revision ID: 6efeb0ad6305
Revises: 00fed4de130a
Create Date: 2026-07-18 12:21:44.200923

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6efeb0ad6305'
down_revision: Union[str, None] = '00fed4de130a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'campaign_analytics',
        sa.Column('id', sa.Uuid(), nullable=False),
        sa.Column('org_id', sa.Uuid(), nullable=False),
        sa.Column('campaign_id', sa.Uuid(), nullable=False),
        sa.Column('total_sent', sa.String(length=50), nullable=True),
        sa.Column('total_opened', sa.String(length=50), nullable=True),
        sa.Column('total_clicked', sa.String(length=50), nullable=True),
        sa.Column('total_bounced', sa.String(length=50), nullable=True),
        sa.Column('total_conversions', sa.String(length=50), nullable=True),
        sa.Column('revenue_attributed', sa.String(length=50), nullable=True),
        sa.Column('spend', sa.String(length=50), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['campaign_id'], ['campaigns.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['org_id'], ['organizations.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    
    op.create_table(
        'social_media_posts',
        sa.Column('id', sa.Uuid(), nullable=False),
        sa.Column('org_id', sa.Uuid(), nullable=False),
        sa.Column('campaign_id', sa.Uuid(), nullable=True),
        sa.Column('platform', sa.String(length=50), nullable=False),
        sa.Column('caption', sa.Text(), nullable=True),
        sa.Column('image_url', sa.String(length=255), nullable=True),
        sa.Column('hashtags', sa.JSON(), nullable=True),
        sa.Column('status', sa.String(length=50), nullable=True),
        sa.Column('scheduled_for', sa.DateTime(), nullable=True),
        sa.Column('published_at', sa.DateTime(), nullable=True),
        sa.Column('provider_post_id', sa.String(length=255), nullable=True),
        sa.Column('likes_count', sa.String(length=50), nullable=True),
        sa.Column('comments_count', sa.String(length=50), nullable=True),
        sa.Column('shares_count', sa.String(length=50), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['campaign_id'], ['campaigns.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['org_id'], ['organizations.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

def downgrade() -> None:
    op.drop_table('social_media_posts')
    op.drop_table('campaign_analytics')
