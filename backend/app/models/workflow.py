"""
SalesPilot AI — Workflow Database Models
"""
import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column, String, Integer, DateTime, ForeignKey, Text, JSON, Index,
)
from sqlalchemy import Uuid as UUID
from app.models.user import Base


def utcnow():
    return datetime.now(timezone.utc)


class Workflow(Base):
    __tablename__ = "workflows"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id = Column(
        UUID(as_uuid=True),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
    )
    name = Column(String(255), nullable=False, default="Untitled Workflow")
    description = Column(Text, nullable=True)
    status = Column(String(50), default="draft")  # draft, active, paused
    version = Column(String(50), default="v1")
    nodes = Column(JSON, default=list)
    edges = Column(JSON, default=list)
    metadata_json = Column(JSON, default=dict)

    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    __table_args__ = (
        Index("ix_workflows_org_id", "org_id"),
        Index("ix_workflows_status", "org_id", "status"),
    )


class WorkflowExecution(Base):
    __tablename__ = "workflow_executions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workflow_id = Column(
        UUID(as_uuid=True),
        ForeignKey("workflows.id", ondelete="CASCADE"),
        nullable=False,
    )
    org_id = Column(
        UUID(as_uuid=True),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
    )
    trigger_type = Column(String(100), nullable=False)
    status = Column(String(50), default="running")  # running, success, failed, waiting
    context = Column(JSON, default=dict)
    logs = Column(JSON, default=list)
    error_message = Column(Text, nullable=True)

    started_at = Column(DateTime(timezone=True), default=utcnow)
    finished_at = Column(DateTime(timezone=True), nullable=True)

    __table_args__ = (
        Index("ix_workflow_executions_workflow_id", "workflow_id"),
        Index("ix_workflow_executions_org_id", "org_id"),
    )
