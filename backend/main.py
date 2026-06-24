from __future__ import annotations

from typing import List

import traceback

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import analytics
from . import database
from . import hotspot_analysis
from . import network_analysis
from . import query_engine
from . import repeat_offenders
from .models import Crime
from .schemas import CrimeSchema
from .schemas import AnalyticsSummary, HotspotPoint, QueryRequest, QueryResponse, RepeatOffender

app = FastAPI(
    title="Crime Intelligence & Analytical Platform",
    description="Prototype API for KSP crime analytics and intelligence.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    database.init_db()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "crime-intelligence-platform"}


@app.get("/crimes", response_model=List[CrimeSchema])
def list_crimes(db: Session = Depends(database.get_db)) -> List[CrimeSchema]:
    crimes = db.query(Crime).all()
    return crimes


@app.get("/crimes/{crime_id}", response_model=CrimeSchema)
def get_crime(crime_id: str, db: Session = Depends(database.get_db)) -> CrimeSchema:
    crime = db.query(Crime).filter(Crime.crime_id == crime_id).first()
    if not crime:
        raise HTTPException(status_code=404, detail="Crime record not found")
    return crime


@app.get("/districts")
def get_districts(db: Session = Depends(database.get_db)) -> List[dict[str, int]]:
    df = analytics.load_crime_dataframe(db)
    return analytics.crimes_by_district_df(df)


@app.get("/crime-types")
def get_crime_types(db: Session = Depends(database.get_db)) -> List[dict[str, int]]:
    df = analytics.load_crime_dataframe(db)
    return analytics.crimes_by_type_df(df)


@app.get("/crime-trends")
def get_crime_trends(db: Session = Depends(database.get_db)) -> List[dict[str, int]]:
    df = analytics.load_crime_dataframe(db)
    return analytics.monthly_crime_trend_df(df)


@app.get("/analytics/summary", response_model=AnalyticsSummary)
def analytics_summary(db: Session = Depends(database.get_db)) -> AnalyticsSummary:
    return analytics.analytics_summary(db)


@app.get("/analytics/crimes-by-district")
def analytics_by_district(db: Session = Depends(database.get_db)) -> List[dict]:
    try:
        return analytics.crimes_by_district(db)
    except Exception as exc:
        print("Error in /analytics/crimes-by-district:", exc)
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Internal analytics error")


@app.get("/analytics/crimes-by-type")
def analytics_by_type(db: Session = Depends(database.get_db)) -> List[dict]:
    try:
        return analytics.crimes_by_type(db)
    except Exception as exc:
        print("Error in /analytics/crimes-by-type:", exc)
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Internal analytics error")


@app.get("/analytics/monthly-trends")
def analytics_monthly_trends(db: Session = Depends(database.get_db)) -> List[dict]:
    try:
        return analytics.monthly_crime_trend(db)
    except Exception as exc:
        print("Error in /analytics/monthly-trends:", exc)
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Internal analytics error")


@app.get("/analytics/severity-distribution")
def analytics_severity_distribution(db: Session = Depends(database.get_db)) -> List[dict[str, int]]:
    return analytics.severity_distribution(db)


@app.get("/analytics/hotspots")
def analytics_hotspots(db: Session = Depends(database.get_db)) -> dict[str, list[HotspotPoint]]:
    return hotspot_analysis.detect_hotspots(db)


@app.get("/analytics/repeat-offenders")
def analytics_repeat_offenders(db: Session = Depends(database.get_db)) -> List[RepeatOffender]:
    return repeat_offenders.top_repeat_offenders(db)


@app.post("/ask", response_model=QueryResponse)
def ask_question(request: QueryRequest, db: Session = Depends(database.get_db)) -> QueryResponse:
    result = query_engine.ask_question(db, request.question)
    return QueryResponse(**result)


@app.get("/hotspots")
def get_hotspots(db: Session = Depends(database.get_db)) -> List[dict[str, int]]:
    df = analytics.load_crime_dataframe(db)
    return analytics.top_hotspots(df)


@app.get("/network/{suspect_id}")
def get_network(suspect_id: str, db: Session = Depends(database.get_db)) -> dict:
    summary = network_analysis.get_connected_entities(db, suspect_id)
    if not summary["connected_crimes"] and not summary["connected_victims"]:
        raise HTTPException(status_code=404, detail="Suspect network not found")
    return summary


@app.get("/network/suspect/{suspect_id}")
def get_suspect_network(suspect_id: str, db: Session = Depends(database.get_db)) -> dict:
    return network_analysis.get_connected_entities(db, suspect_id)
