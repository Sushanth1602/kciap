from __future__ import annotations

from datetime import date, time
from typing import Any, List

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
