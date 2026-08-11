"""
SalesPilot AI — Workflow Service
"""
import uuid
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException

from app.models.workflow import Workflow, WorkflowExecution
from app.schemas.workflow import WorkflowCreate, WorkflowUpdate, WorkflowTestRequest


class WorkflowService:

    @staticmethod
    async def create_workflow(db: AsyncSession, org_id: uuid.UUID, data: WorkflowCreate) -> Workflow:
        workflow = Workflow(
            org_id=org_id,
            name=data.name,
            description=data.description,
            status="draft",
            version="v1",
            nodes=data.nodes,
            edges=data.edges,
            metadata_json=data.metadata_json or {},
        )
        db.add(workflow)
        await db.commit()
        await db.refresh(workflow)
        return workflow

    @staticmethod
    async def get_workflows(db: AsyncSession, org_id: uuid.UUID) -> List[Workflow]:
        result = await db.execute(
            select(Workflow)
            .where(Workflow.org_id == org_id)
            .order_by(Workflow.updated_at.desc())
        )
        return result.scalars().all()

    @staticmethod
    async def get_workflow(db: AsyncSession, org_id: uuid.UUID, workflow_id: uuid.UUID) -> Workflow:
        result = await db.execute(
            select(Workflow).where(Workflow.id == workflow_id, Workflow.org_id == org_id)
        )
        workflow = result.scalars().first()
        if not workflow:
            raise HTTPException(status_code=404, detail="Workflow not found")
        return workflow

    @staticmethod
    async def update_workflow(
        db: AsyncSession, org_id: uuid.UUID, workflow_id: uuid.UUID, data: WorkflowUpdate
    ) -> Workflow:
        workflow = await WorkflowService.get_workflow(db, org_id, workflow_id)
        
        if data.name is not None:
            workflow.name = data.name
        if data.description is not None:
            workflow.description = data.description
        if data.status is not None:
            workflow.status = data.status
        if data.nodes is not None:
            workflow.nodes = data.nodes
        if data.edges is not None:
            workflow.edges = data.edges
        if data.metadata_json is not None:
            workflow.metadata_json = data.metadata_json
            
        workflow.updated_at = datetime.now(timezone.utc)
        await db.commit()
        await db.refresh(workflow)
        return workflow

    @staticmethod
    async def delete_workflow(db: AsyncSession, org_id: uuid.UUID, workflow_id: uuid.UUID) -> None:
        workflow = await WorkflowService.get_workflow(db, org_id, workflow_id)
        await db.delete(workflow)
        await db.commit()

    @staticmethod
    async def deploy_workflow(
        db: AsyncSession, org_id: uuid.UUID, workflow_id: uuid.UUID, payload: Dict[str, Any]
    ) -> Workflow:
        workflow = await WorkflowService.get_workflow(db, org_id, workflow_id)
        
        # Calculate new version
        current_version_num = 1
        if workflow.version and workflow.version.startswith("v"):
            try:
                current_version_num = int(workflow.version[1:]) + 1
            except ValueError:
                current_version_num = 2

        workflow.version = f"v{current_version_num}"
        workflow.status = "active"
        if "nodes" in payload:
            workflow.nodes = payload["nodes"]
        if "edges" in payload:
            workflow.edges = payload["edges"]
            
        workflow.updated_at = datetime.now(timezone.utc)
        await db.commit()
        await db.refresh(workflow)
        return workflow

    @staticmethod
    async def get_executions(
        db: AsyncSession, org_id: uuid.UUID, workflow_id: uuid.UUID
    ) -> List[WorkflowExecution]:
        result = await db.execute(
            select(WorkflowExecution)
            .where(WorkflowExecution.workflow_id == workflow_id, WorkflowExecution.org_id == org_id)
            .order_by(WorkflowExecution.started_at.desc())
        )
        return result.scalars().all()

    @staticmethod
    async def record_execution(
        db: AsyncSession,
        org_id: uuid.UUID,
        workflow_id: uuid.UUID,
        trigger_type: str,
        status: str,
        context: Dict[str, Any],
        logs: List[Dict[str, Any]],
        error_message: Optional[str] = None,
    ) -> WorkflowExecution:
        execution = WorkflowExecution(
            workflow_id=workflow_id,
            org_id=org_id,
            trigger_type=trigger_type,
            status=status,
            context=context,
            logs=logs,
            error_message=error_message,
            started_at=datetime.now(timezone.utc),
            finished_at=datetime.now(timezone.utc) if status != "running" else None,
        )
        db.add(execution)
        await db.commit()
        await db.refresh(execution)
        return execution
