from __future__ import annotations

from datetime import datetime
from typing import Any

import pandas as pd
from sqlalchemy import func
from sqlalchemy.orm import Session

try:
    from .models import Crime
except ImportError:
    from models import Crime


def load_crime_dataframe(db: Session) -> pd.DataFrame:
    query = db.query(Crime)
    rows = query.all()
    data = [
        {
            "crime_id": crime.crime_id,
            "crime_type": crime.crime_type,
            "district": crime.district,
            "crime_date": crime.crime_date,
            "crime_time": crime.crime_time,
            "latitude": crime.latitude,
            "longitude": crime.longitude,
            "suspect_id": crime.suspect_id,
            "victim_id": crime.victim_id,
            "weapon_used": crime.weapon_used,
            "modus_operandi": crime.modus_operandi,
            "severity": crime.severity,
            "status": crime.status,
        }
        for crime in rows
    ]
    df = pd.DataFrame(data)
    if not df.empty:
        df["crime_date"] = pd.to_datetime(df["crime_date"])
    return df


def analytics_summary(db: Session) -> dict[str, int]:
    total = db.query(func.count(Crime.id)).scalar() or 0
    active = db.query(func.count(Crime.id)).filter(Crime.status != "Closed").scalar() or 0
    closed = db.query(func.count(Crime.id)).filter(Crime.status == "Closed").scalar() or 0
    high_severity = db.query(func.count(Crime.id)).filter(Crime.severity >= 4).scalar() or 0
    return {
        "total_crimes": int(total),
        "active_cases": int(active),
        "closed_cases": int(closed),
        "high_severity_cases": int(high_severity),
    }


def crimes_by_district(db: Session) -> list[dict[str, Any]]:
    rows = db.query(Crime.district, func.count(Crime.id).label("count")).group_by(Crime.district).order_by(func.count(Crime.id).desc()).all()
    result = [{"district": district or "", "count": int(count)} for district, count in rows]
    print("District analytics:", result)
    return result


def crimes_by_type(db: Session) -> list[dict[str, Any]]:
    rows = db.query(Crime.crime_type, func.count(Crime.id).label("count")).group_by(Crime.crime_type).order_by(func.count(Crime.id).desc()).all()
    result = [{"crime_type": crime_type or "", "count": int(count)} for crime_type, count in rows]
    print("Crime type analytics:", result)
    return result


def monthly_crime_trend(db: Session) -> list[dict[str, Any]]:
    rows = (
        db.query(func.strftime("%Y-%m", Crime.crime_date).label("period"), func.count(Crime.id).label("count"))
        .group_by("period")
        .order_by("period")
        .all()
    )
    result = [{"month": period or "", "count": int(count)} for period, count in rows]
    print("Monthly trends:", result)
    return result


def severity_distribution(db: Session) -> list[dict[str, Any]]:
    rows = db.query(Crime.severity, func.count(Crime.id).label("count")).group_by(Crime.severity).order_by(Crime.severity).all()
    return [{"severity": int(severity), "count": int(count)} for severity, count in rows]


def total_crime_count(df: pd.DataFrame) -> int:
    return int(df.shape[0])


def crimes_by_district_df(df: pd.DataFrame) -> list[dict[str, Any]]:
    if df.empty:
        return []
    result = [{"district": district or "", "count": int(count)} for district, count in df["district"].value_counts().items()]
    print("District analytics (df):", result)
    return result


def crimes_by_type_df(df: pd.DataFrame) -> list[dict[str, Any]]:
    if df.empty:
        return []
    result = [{"crime_type": crime_type or "", "count": int(count)} for crime_type, count in df["crime_type"].value_counts().items()]
    print("Crime type analytics (df):", result)
    return result


def monthly_crime_trend_df(df: pd.DataFrame) -> list[dict[str, Any]]:
    if df.empty:
        return []
    trend = df.groupby(df["crime_date"].dt.to_period("M")).size().sort_index()
    result = [{"month": str(period), "count": int(count)} for period, count in trend.items()]
    print("Monthly trends (df):", result)
    return result


def top_hotspots(df: pd.DataFrame, top_n: int = 10) -> list[dict[str, Any]]:
    if df.empty:
        return []
    rounded = df.copy()
    rounded["lat_round"] = rounded["latitude"].round(3)
    rounded["lon_round"] = rounded["longitude"].round(3)
    counts = rounded.groupby(["lat_round", "lon_round"]).size().sort_values(ascending=False).head(top_n)
    return [
        {"latitude": float(lat), "longitude": float(lon), "count": int(count)}
        for (lat, lon), count in counts.items()
    ]


def crime_counts_by_weapon(df: pd.DataFrame) -> list[dict[str, Any]]:
    return [{"weapon_used": weapon, "count": int(count)} for weapon, count in df["weapon_used"].value_counts().items()]
