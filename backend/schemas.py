from __future__ import annotations

import uuid
from datetime import date, time, datetime
from typing import Any, List, Optional
from pydantic import BaseModel

class CrimeSchema(BaseModel):
    crime_id: str
    crime_type: str
    district: str
    police_station: str
    crime_date: date
    crime_time: time
    latitude: float
    longitude: float
    suspect_id: str
    victim_id: str
    weapon_used: str
    modus_operandi: str
    severity: int
    status: str

    model_config = {
        "from_attributes": True,
    }

class AnalyticsSummary(BaseModel):
    total_crimes: int
    active_cases: int
    closed_cases: int
    high_severity_cases: int

class HotspotPoint(BaseModel):
    cluster_id: int
    crime_count: int
    center_lat: float
    center_lon: float

class RepeatOffender(BaseModel):
    suspect_id: str
    crime_count: int
    average_severity: float
    open_cases: int
    offender_score: float

class QueryRequest(BaseModel):
    question: str

class QueryResponse(BaseModel):
    answer: str
    data: list[dict[str, Any]]

class TrendPoint(BaseModel):
    period: str
    count: int

class LocationHotspotPoint(BaseModel):
    latitude: float
    longitude: float
    count: int

class NetworkSummary(BaseModel):
    suspect_id: str
    connected_crimes: List[str]
    connected_victims: List[str]
    nodes: List[dict]
    edges: List[dict]

# New Supabase-linked schemas
class ProfileCreate(BaseModel):
    id: str
    full_name: str
    email: str
    phone: Optional[str] = None
    role: str = "Citizen"

class ProfileSchema(BaseModel):
    id: str
    full_name: str
    email: str
    phone: Optional[str]
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

class OfficerCreate(BaseModel):
    id: str
    badge_number: str
    rank: str
    district: str
    police_station: str

class OfficerSchema(BaseModel):
    id: str
    badge_number: str
    rank: str
    district: str
    police_station: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class CitizenCreate(BaseModel):
    id: str
    aadhaar_number: Optional[str] = None
    address: Optional[str] = None

class CitizenSchema(BaseModel):
    id: str
    aadhaar_number: Optional[str]
    address: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class ComplaintCreate(BaseModel):
    title: str
    description: str
    incident_date: date
    district: str
    police_station: str
    citizen_id: str

class ComplaintSchema(BaseModel):
    id: uuid.UUID
    citizen_id: Optional[uuid.UUID]
    title: str
    description: str
    incident_date: date
    district: str
    police_station: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class CrimeReportCreate(BaseModel):
    complaint_id: Optional[str] = None
    crime_type: str
    severity_level: int
    modus_operandi: Optional[str] = None
    weapon_used: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    assigned_officer_id: Optional[str] = None

class CrimeReportSchema(BaseModel):
    id: uuid.UUID
    complaint_id: Optional[uuid.UUID]
    crime_type: str
    severity_level: int
    modus_operandi: Optional[str]
    weapon_used: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    assigned_officer_id: Optional[uuid.UUID]
    created_at: datetime

    class Config:
        from_attributes = True

class NotificationSchema(BaseModel):
    id: uuid.UUID
    recipient_id: uuid.UUID
    title: str
    message: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True
