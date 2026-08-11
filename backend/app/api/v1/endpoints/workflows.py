"""
SalesPilot AI — Workflow API Endpoints
"""
import uuid
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.models.user import User
from app.api.v1.deps import RequirePermission, get_current_org_id
from app.schemas.workflow import (
    WorkflowCreate, WorkflowUpdate, WorkflowResponse,
    WorkflowExecutionResponse, WorkflowTestRequest,
)
from app.services.workflow_service import WorkflowService

router = APIRouter()


@router.post("", response_model=WorkflowResponse, status_code=status.HTTP_201_CREATED)
async def create_workflow(
    workflow_in: WorkflowCreate,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("crm:write")),
):
    return await WorkflowService.create_workflow(db, org_id, workflow_in)


@router.get("", response_model=List[WorkflowResponse])
async def list_workflows(
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("crm:read")),
):
    return await WorkflowService.get_workflows(db, org_id)


@router.get("/{workflow_id}", response_model=WorkflowResponse)
async def get_workflow(
    workflow_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("crm:read")),
):
    return await WorkflowService.get_workflow(db, org_id, workflow_id)


@router.put("/{workflow_id}", response_model=WorkflowResponse)
async def update_workflow(
    workflow_id: uuid.UUID,
    workflow_in: WorkflowUpdate,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("crm:write")),
):
    return await WorkflowService.update_workflow(db, org_id, workflow_id, workflow_in)


@router.delete("/{workflow_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_workflow(
    workflow_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("crm:write")),
):
    await WorkflowService.delete_workflow(db, org_id, workflow_id)
    return None


@router.post("/{workflow_id}/deploy", response_model=WorkflowResponse)
async def deploy_workflow(
    workflow_id: uuid.UUID,
    payload: Dict[str, Any],
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("crm:write")),
):
    return await WorkflowService.deploy_workflow(db, org_id, workflow_id, payload)


@router.get("/{workflow_id}/executions", response_model=List[WorkflowExecutionResponse])
async def list_executions(
    workflow_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("crm:read")),
):
    return await WorkflowService.get_executions(db, org_id, workflow_id)


@router.post("/{workflow_id}/execute")
async def execute_workflow(
    workflow_id: uuid.UUID,
    payload: Dict[str, Any],
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
    current_user: User = Depends(RequirePermission("crm:write")),
):
    workflow = await WorkflowService.get_workflow(db, org_id, workflow_id)
    # Record execution starting
    logs = [
        {"timestamp": "0s", "node": "Trigger", "status": "success", "message": f"Workflow {workflow.name} triggered."}
    ]
    execution = await WorkflowService.record_execution(
        db, org_id, workflow_id,
        trigger_type=payload.get("type", "incoming_call"),
        status="success",
        context=payload,
        logs=logs
    )
    return {
        "executionId": str(execution.id),
        "status": "success",
        "workflowId": str(workflow.id),
        "version": workflow.version,
    }
