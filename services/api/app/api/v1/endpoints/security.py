"""
Security API Endpoints
MFA setup, session management, health checks, GDPR compliance, and monitoring.
"""
import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel
from datetime import datetime

from app.database.session import get_db
from app.models.user import User
from app.models.iam import Session
from app.api.v1.deps import get_current_active_user, get_current_org_id, RequirePermission
from app.services.security import (
    MFAService, HealthMonitor, ComplianceService, AIGuardrails, FileSecurityService, AuditLogger
)

router = APIRouter()


# ─── Schemas ───
class MFASetupResponse(BaseModel):
    secret: str
    otpauth_uri: str
    recovery_codes: List[str]

class MFAVerifyRequest(BaseModel):
    code: str

class AIValidationRequest(BaseModel):
    prompt: str

class FileValidationRequest(BaseModel):
    filename: str
    file_size_bytes: int
    category: str = "document"


# ─── MFA Endpoints ───

@router.post("/mfa/setup", response_model=MFASetupResponse)
async def setup_mfa(
    current_user: User = Depends(get_current_active_user),
):
    """Generate TOTP secret, QR URI, and recovery codes for MFA enrollment."""
    secret = MFAService.generate_totp_secret()
    uri = MFAService.generate_totp_uri(secret, current_user.email)
    codes = MFAService.generate_recovery_codes()

    # In production, encrypt and store secret + hashed recovery codes on the user record.
    return MFASetupResponse(
        secret=secret,
        otpauth_uri=uri,
        recovery_codes=codes
    )


@router.post("/mfa/verify")
async def verify_mfa(
    req: MFAVerifyRequest,
    current_user: User = Depends(get_current_active_user),
):
    """Verify a 6-digit TOTP code. In production, read the stored secret from DB."""
    # For demo purposes, we accept any 6-digit code that looks valid
    if len(req.code) != 6 or not req.code.isdigit():
        raise HTTPException(status_code=400, detail="Invalid OTP format. Must be 6 digits.")
    return {"verified": True, "message": "MFA verification successful."}


# ─── Session Management ───

@router.get("/sessions")
async def list_sessions(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """List all active sessions for the current user."""
    result = await db.execute(
        select(Session)
        .where(Session.user_id == current_user.id, Session.is_revoked == False)
        .order_by(Session.last_activity.desc())
    )
    sessions = result.scalars().all()
    return [
        {
            "id": str(s.id),
            "device_info": s.device_info,
            "ip_address": s.ip_address,
            "created_at": s.created_at.isoformat() if s.created_at else None,
            "last_activity": s.last_activity.isoformat() if s.last_activity else None,
            "expires_at": s.expires_at.isoformat() if s.expires_at else None,
        }
        for s in sessions
    ]


@router.delete("/sessions/{session_id}")
async def revoke_session(
    session_id: uuid.UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Revoke a specific session (log out a device)."""
    result = await db.execute(
        select(Session).where(Session.id == session_id, Session.user_id == current_user.id)
    )
    session = result.scalars().first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    session.is_revoked = True
    await db.commit()
    return {"message": "Session revoked successfully."}


@router.post("/sessions/revoke-all")
async def revoke_all_sessions(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Revoke all sessions for the current user (log out everywhere)."""
    result = await db.execute(
        select(Session).where(Session.user_id == current_user.id, Session.is_revoked == False)
    )
    sessions = result.scalars().all()
    for s in sessions:
        s.is_revoked = True
    await db.commit()
    return {"message": f"Revoked {len(sessions)} active sessions."}


# ─── AI Security ───

@router.post("/ai/validate")
async def validate_ai_prompt(
    req: AIValidationRequest,
    current_user: User = Depends(get_current_active_user),
):
    """Validate an AI prompt for injection attacks and data leakage."""
    result = AIGuardrails.validate_ai_request(req.prompt)
    if not result["safe"]:
        raise HTTPException(status_code=400, detail={
            "message": "AI request blocked by security guardrails.",
            "analysis": result
        })
    return {"safe": True, "message": "Prompt passed security validation."}


# ─── File Security ───

@router.post("/files/validate")
async def validate_file_upload(
    req: FileValidationRequest,
    current_user: User = Depends(get_current_active_user),
):
    """Pre-validate a file before upload."""
    result = FileSecurityService.validate_file(req.filename, req.file_size_bytes, req.category)
    if not result["valid"]:
        raise HTTPException(status_code=400, detail=result["reason"])
    return result


# ─── Health & Monitoring ───

@router.get("/health/deep")
async def deep_health_check(db: AsyncSession = Depends(get_db)):
    """Deep health check including database and Redis connectivity."""
    return await HealthMonitor.full_health_check(db)


# ─── GDPR / Compliance ───

@router.get("/compliance/export")
async def export_my_data(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Export all data associated with the current user (GDPR Art. 20)."""
    return await ComplianceService.export_user_data(db, current_user.id)


@router.post("/compliance/delete-account")
async def request_account_deletion(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
    org_id: uuid.UUID = Depends(get_current_org_id),
):
    """Anonymize user data and deactivate account (GDPR Art. 17)."""
    await AuditLogger.log(
        db=db,
        org_id=org_id,
        user_id=current_user.id,
        action="account_deletion_requested",
        resource_type="user",
        resource_id=str(current_user.id),
    )
    success = await ComplianceService.anonymize_user(db, current_user.id)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to process deletion request.")
    await db.commit()
    return {"message": "Account has been anonymized and deactivated."}
