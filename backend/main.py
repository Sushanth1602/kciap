from __future__ import annotations

from typing import List, Optional
import traceback
import uuid

# pyrefly: ignore [missing-import]
from fastapi import Depends, FastAPI, HTTPException
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import analytics
from . import database
from . import hotspot_analysis
from . import network_analysis
from . import query_engine
from . import repeat_offenders
from .models import Crime, Profile, Officer, Citizen, Complaint, CrimeReport, Notification
from .schemas import (
    CrimeSchema, AnalyticsSummary, HotspotPoint, QueryRequest, QueryResponse, RepeatOffender,
    ProfileCreate, ProfileSchema, OfficerCreate, OfficerSchema, CitizenCreate, CitizenSchema,
    ComplaintCreate, ComplaintSchema, CrimeReportCreate, CrimeReportSchema, NotificationSchema
)

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

# AUTHENTICATION & PORTAL REGISTRATION ROUTES
@app.post("/auth/register", response_model=ProfileSchema)
def register_user(profile: ProfileCreate, db: Session = Depends(database.get_db)) -> Profile:
    db_profile = db.query(Profile).filter(Profile.id == profile.id).first()
    if db_profile:
        # Update existing profile
        db_profile.full_name = profile.full_name
        db_profile.email = profile.email
        db_profile.phone = profile.phone
        db_profile.role = profile.role
        db.commit()
        db.refresh(db_profile)
        return db_profile
    
    new_profile = Profile(
        id=profile.id,
        full_name=profile.full_name,
        email=profile.email,
        phone=profile.phone,
        role=profile.role
    )
    db.add(new_profile)
    try:
        db.commit()
        db.refresh(new_profile)
    except Exception as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Database profile registration failed: {str(exc)}")
    
    return new_profile

@app.post("/auth/login", response_model=ProfileSchema)
def login_user(email: str, db: Session = Depends(database.get_db)) -> Profile:
    db_profile = db.query(Profile).filter(Profile.email == email).first()
    if not db_profile:
        raise HTTPException(status_code=404, detail="User profile not registered")
    return db_profile

@app.post("/profile", response_model=ProfileSchema)
def create_or_update_profile(profile: ProfileCreate, db: Session = Depends(database.get_db)) -> Profile:
    return register_user(profile, db)

@app.post("/profile/assign-role", response_model=ProfileSchema)
def assign_role(profile_id: str, role: str, db: Session = Depends(database.get_db)) -> Profile:
    if role not in ['Citizen', 'Police Officer', 'Government Official']:
        raise HTTPException(status_code=400, detail="Invalid access role value")
    
    db_profile = db.query(Profile).filter(Profile.id == profile_id).first()
    if not db_profile:
        raise HTTPException(status_code=404, detail="User profile not found")
    
    db_profile.role = role
    db.commit()
    db.refresh(db_profile)
    return db_profile

# OFFICERS & CITIZENS PORTALS METADATA ROUTING
@app.post("/officers", response_model=OfficerSchema)
def register_officer(officer: OfficerCreate, db: Session = Depends(database.get_db)) -> Officer:
    db_profile = db.query(Profile).filter(Profile.id == officer.id).first()
    if not db_profile:
        raise HTTPException(status_code=404, detail="No profile matches this officer ID")
    
    db_officer = db.query(Officer).filter(Officer.id == officer.id).first()
    if db_officer:
        db_officer.badge_number = officer.badge_number
        db_officer.rank = officer.rank
        db_officer.district = officer.district
        db_officer.police_station = officer.police_station
        db.commit()
        db.refresh(db_officer)
        return db_officer

    new_officer = Officer(
        id=officer.id,
        badge_number=officer.badge_number,
        rank=officer.rank,
        district=officer.district,
        police_station=officer.police_station
    )
    db.add(new_officer)
    try:
        db.commit()
        db.refresh(new_officer)
    except Exception as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Officer registration failed: {str(exc)}")
    return new_officer

@app.post("/citizens", response_model=CitizenSchema)
def register_citizen(citizen: CitizenCreate, db: Session = Depends(database.get_db)) -> Citizen:
    db_profile = db.query(Profile).filter(Profile.id == citizen.id).first()
    if not db_profile:
        raise HTTPException(status_code=404, detail="No profile matches this citizen ID")
    
    db_citizen = db.query(Citizen).filter(Citizen.id == citizen.id).first()
    if db_citizen:
        db_citizen.aadhaar_number = citizen.aadhaar_number
        db_citizen.address = citizen.address
        db.commit()
        db.refresh(db_citizen)
        return db_citizen

    new_citizen = Citizen(
        id=citizen.id,
        aadhaar_number=citizen.aadhaar_number,
        address=citizen.address
    )
    db.add(new_citizen)
    try:
        db.commit()
        db.refresh(new_citizen)
    except Exception as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Citizen registration failed: {str(exc)}")
    return new_citizen

# COMPLAINT SUBMISSION & ASSIGNMENT PORTAL ROUTING
# COMPLAINT SUBMISSION & ASSIGNMENT PORTAL ROUTING
@app.post("/complaints", response_model=ComplaintSchema)
def submit_complaint(complaint: ComplaintCreate, db: Session = Depends(database.get_db)) -> Complaint:
    # Verify citizen profile exists using safety UUID format check
    citizen_uuid = None
    try:
        citizen_uuid = uuid.UUID(str(complaint.citizen_id))
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid citizen_id format. Must be a valid UUID string.")

    db_profile = db.query(Profile).filter(Profile.id == citizen_uuid).first()
    if not db_profile:
         raise HTTPException(status_code=404, detail="Citizen profile not found")

    new_complaint = Complaint(
        citizen_id=citizen_uuid,
        title=complaint.title,
        description=complaint.description,
        incident_date=complaint.incident_date,
        district=complaint.district,
        police_station=complaint.police_station,
        status="Pending"
    )
    db.add(new_complaint)
    try:
        db.commit()
        db.refresh(new_complaint)
    except Exception as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Complaint submission failed: {str(exc)}")
    return new_complaint

@app.get("/complaints", response_model=List[ComplaintSchema])
def list_complaints(citizen_id: Optional[str] = None, db: Session = Depends(database.get_db)) -> List[Complaint]:
    query = db.query(Complaint)
    if citizen_id:
        try:
            citizen_uuid = uuid.UUID(str(citizen_id))
            query = query.filter(Complaint.citizen_id == citizen_uuid)
        except ValueError:
            return []
    return query.all()

@app.post("/crime-reports", response_model=CrimeReportSchema)
def create_crime_report(report: CrimeReportCreate, db: Session = Depends(database.get_db)) -> CrimeReport:
    comp_uuid = None
    if report.complaint_id:
        try:
            comp_uuid = uuid.UUID(str(report.complaint_id))
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid complaint_id format. Must be a valid UUID.")

    officer_uuid = None
    if report.assigned_officer_id:
        try:
            officer_uuid = uuid.UUID(str(report.assigned_officer_id))
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid assigned_officer_id format. Must be a valid UUID.")

    new_report = CrimeReport(
        complaint_id=comp_uuid,
        crime_type=report.crime_type,
        severity_level=report.severity_level,
        modus_operandi=report.modus_operandi,
        weapon_used=report.weapon_used,
        latitude=report.latitude,
        longitude=report.longitude,
        assigned_officer_id=officer_uuid
    )
    db.add(new_report)
    
    # If linked to a complaint, update the complaint status
    if comp_uuid:
        db_complaint = db.query(Complaint).filter(Complaint.id == comp_uuid).first()
        if db_complaint:
            db_complaint.status = "Under Investigation"
            
    try:
        db.commit()
        db.refresh(new_report)
    except Exception as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Crime report creation failed: {str(exc)}")
    return new_report

@app.get("/notifications/{recipient_id}", response_model=List[NotificationSchema])
def get_notifications(recipient_id: str, db: Session = Depends(database.get_db)) -> List[Notification]:
    try:
        recipient_uuid = uuid.UUID(str(recipient_id))
        return db.query(Notification).filter(Notification.recipient_id == recipient_uuid).all()
    except ValueError:
        return []

# CORE ANALYTICS PORTAL ROUTING
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
