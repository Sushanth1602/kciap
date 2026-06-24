from __future__ import annotations

import uuid
from datetime import datetime
from sqlalchemy import Column, Date, Integer, String, Time, Float, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.types import TypeDecorator, CHAR
from sqlalchemy.dialects.postgresql import UUID as PG_UUID

Base = declarative_base()

# Platform-independent GUID type
class GUID(TypeDecorator):
    """Platform-independent GUID type.
    Uses PostgreSQL's UUID type, otherwise CHAR(36) in SQLite.
    """
    impl = CHAR
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == 'postgresql':
            return dialect.type_descriptor(PG_UUID(as_uuid=True))
        else:
            return dialect.type_descriptor(CHAR(36))

    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        elif dialect.name == 'postgresql':
            return str(value)
        else:
            if not isinstance(value, uuid.UUID):
                try:
                    return str(uuid.UUID(str(value)))
                except ValueError:
                    return str(value)
            else:
                return str(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return value
        else:
            if not isinstance(value, uuid.UUID):
                try:
                    return uuid.UUID(str(value))
                except ValueError:
                    return value
            else:
                return value

class Suspect(Base):
    __tablename__ = "suspects"

    id = Column(Integer, primary_key=True, autoincrement=True)
    suspect_id = Column(String(16), unique=True, nullable=False)
    name = Column(String(128), nullable=False)
    age = Column(Integer, nullable=True)
    gender = Column(String(16), nullable=True)
    crimes = relationship("Crime", back_populates="suspect")

class Victim(Base):
    __tablename__ = "victims"

    id = Column(Integer, primary_key=True, autoincrement=True)
    victim_id = Column(String(16), unique=True, nullable=False)
    name = Column(String(128), nullable=False)
    age = Column(Integer, nullable=True)
    gender = Column(String(16), nullable=True)
    crimes = relationship("Crime", back_populates="victim")

class Crime(Base):
    __tablename__ = "crimes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    crime_id = Column(String(32), unique=True, nullable=False)
    crime_type = Column(String(64), nullable=False)
    district = Column(String(64), nullable=False)
    police_station = Column(String(128), nullable=False)
    crime_date = Column(Date, nullable=False)
    crime_time = Column(Time, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    suspect_id = Column(String(16), ForeignKey("suspects.suspect_id"), nullable=False)
    victim_id = Column(String(16), ForeignKey("victims.victim_id"), nullable=False)
    weapon_used = Column(String(64), nullable=False)
    modus_operandi = Column(String(128), nullable=False)
    severity = Column(Integer, nullable=False)
    status = Column(String(64), nullable=False)

    suspect = relationship("Suspect", back_populates="crimes")
    victim = relationship("Victim", back_populates="crimes")

# Supabase Auth-linked tables
class Profile(Base):
    __tablename__ = "profiles"

    id = Column(GUID, primary_key=True)
    full_name = Column(String(256), nullable=False)
    email = Column(String(256), unique=True, nullable=False)
    phone = Column(String(32), nullable=True)
    role = Column(String(64), nullable=False, default="Citizen")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Officer(Base):
    __tablename__ = "officers"

    id = Column(GUID, ForeignKey("profiles.id", ondelete="CASCADE"), primary_key=True)
    badge_number = Column(String(64), unique=True, nullable=False)
    rank = Column(String(64), nullable=False)
    district = Column(String(64), nullable=False)
    police_station = Column(String(128), nullable=False)
    status = Column(String(64), nullable=False, default="Active")
    created_at = Column(DateTime, default=datetime.utcnow)

class Citizen(Base):
    __tablename__ = "citizens"

    id = Column(GUID, ForeignKey("profiles.id", ondelete="CASCADE"), primary_key=True)
    aadhaar_number = Column(String(32), unique=True, nullable=True)
    address = Column(String(512), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    citizen_id = Column(GUID, ForeignKey("profiles.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(256), nullable=False)
    description = Column(String(1024), nullable=False)
    incident_date = Column(Date, nullable=False)
    district = Column(String(64), nullable=False)
    police_station = Column(String(128), nullable=False)
    status = Column(String(64), nullable=False, default="Pending")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class CrimeReport(Base):
    __tablename__ = "crime_reports"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    complaint_id = Column(GUID, ForeignKey("complaints.id", ondelete="SET NULL"), nullable=True)
    crime_type = Column(String(64), nullable=False)
    severity_level = Column(Integer, nullable=False)
    modus_operandi = Column(String(256), nullable=True)
    weapon_used = Column(String(64), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    assigned_officer_id = Column(GUID, ForeignKey("profiles.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class AnalyticsMetric(Base):
    __tablename__ = "analytics"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    metric_name = Column(String(128), nullable=False)
    metric_value = Column(String(1024), nullable=False) # JSON encoded string
    calculated_at = Column(DateTime, default=datetime.utcnow)

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(GUID, primary_key=True, default=uuid.uuid4)
    recipient_id = Column(GUID, ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(256), nullable=False)
    message = Column(String(1024), nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
