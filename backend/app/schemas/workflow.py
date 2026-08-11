"""
SalesPilot AI — Workflow Schemas
"""
import uuid
from typing import List, Dict, Any, Optional
from datetime import datetime
from pydantic import BaseModel, Field


class NodeModel(BaseModel):
    id: str
    type: str
    subtype: Optional[str] = None
    position: Dict[str, float]
    config: Optional[Dict[str, Any]] = Field(default_factory=dict)
    data: Optional[Dict[str, Any]] = Field(default_factory=dict)


class EdgeModel(BaseModel):
    id: str
    source: str
    target: str
    condition: Optional[str] = None
    animated: Optional[bool] = True
    type: Optional[str] = "animatedEdge"


class WorkflowCreate(BaseModel):
    name: str = "Untitled Workflow"
    description: Optional[str] = ""
    nodes: List[Dict[str, Any]] = Field(default_factory=list)
    edges: List[Dict[str, Any]] = Field(default_factory=list)
    metadata_json: Optional[Dict[str, Any]] = Field(default_factory=dict)


class WorkflowUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    nodes: Optional[List[Dict[str, Any]]] = None
    edges: Optional[List[Dict[str, Any]]] = None
    metadata_json: Optional[Dict[str, Any]] = None


class WorkflowResponse(BaseModel):
    id: uuid.UUID
    org_id: uuid.UUID
    name: str
    description: Optional[str] = None
    status: str
    version: str
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]
    metadata_json: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class WorkflowExecutionResponse(BaseModel):
    id: uuid.UUID
    workflow_id: uuid.UUID
    org_id: uuid.UUID
    trigger_type: str
    status: str
    context: Dict[str, Any]
    logs: List[Dict[str, Any]]
    error_message: Optional[str] = None
    started_at: datetime
    finished_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class WorkflowTestRequest(BaseModel):
    trigger_type: str = "incoming_call"
    callerPhone: Optional[str] = "+15551234567"
    callerName: Optional[str] = "John Smith"
    transcript: Optional[str] = "I want an enterprise proposal for my company."
    nodes: Optional[List[Dict[str, Any]]] = None
    edges: Optional[List[Dict[str, Any]]] = None
