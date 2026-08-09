import uuid
from datetime import datetime
from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    Boolean,
    DateTime,
    ForeignKey,
    Text,
)
from sqlalchemy import Uuid as UUID
from app.models.user import Base


class VoiceProfile(Base):
    __tablename__ = "voice_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id = Column(
        UUID(as_uuid=True),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
    )
    name = Column(String(100), nullable=False)
    tts_provider = Column(String(50), default="elevenlabs")
    voice_id = Column(String(100), nullable=False)  # e.g. ElevenLabs ID
    language = Column(String(20), default="en-US")
    speaking_rate = Column(Float, default=1.0)
    pitch = Column(Float, default=0.0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class VoiceCall(Base):
    __tablename__ = "voice_calls"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id = Column(
        UUID(as_uuid=True),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
    )
    customer_id = Column(
        UUID(as_uuid=True),
        ForeignKey("customers.id", ondelete="SET NULL"),
        nullable=True,
    )
    profile_id = Column(
        UUID(as_uuid=True),
        ForeignKey("voice_profiles.id", ondelete="SET NULL"),
        nullable=True,
    )

    call_sid = Column(String(100), unique=True)  # Twilio Call SID
    direction = Column(String(20))  # inbound, outbound
    from_number = Column(String(50))
    to_number = Column(String(50))
    status = Column(
        String(50), default="queued"
    )  # queued, in-progress, completed, failed
    duration_seconds = Column(Integer, default=0)
    cost = Column(Float, default=0.0)

    recording_url = Column(String(500))
    consent_given = Column(Boolean, default=False)
    
    transcript = Column(Text, nullable=True)
    summary = Column(Text, nullable=True)

    started_at = Column(DateTime)
    ended_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)


class CallTranscript(Base):
    __tablename__ = "call_transcripts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    call_id = Column(
        UUID(as_uuid=True),
        ForeignKey("voice_calls.id", ondelete="CASCADE"),
        nullable=False,
    )
    speaker = Column(String(20))  # AI or Customer
    text = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)


class VoiceAnalytics(Base):
    __tablename__ = "voice_analytics"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    call_id = Column(
        UUID(as_uuid=True),
        ForeignKey("voice_calls.id", ondelete="CASCADE"),
        nullable=False,
    )
    sentiment_score = Column(Float)
    customer_talk_ratio = Column(Float)  # percentage of time customer spoke
    silence_duration = Column(Integer)  # in seconds
    ai_latency_avg_ms = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
