from __future__ import annotations

import re
from typing import Any

from sqlalchemy import func
from sqlalchemy.orm import Session

from .models import Crime
from .repeat_offenders import top_repeat_offenders

CRIME_TYPES = [
    "theft",
    "vehicle theft",
    "burglary",
    "murder",
    "assault",
    "cyber fraud",
    "drug offence",
    "kidnapping",
    "robbery",
    "domestic violence",
]

DISTRICTS = [
    "bengaluru urban",
    "mysuru",
    "mangaluru",
    "belagavi",
    "kalaburagi",
    "shivamogga",
    "hubballi-dharwad",
    "tumakuru",
    "ballari",
    "vijayapura",
]


def normalize_text(value: str) -> str:
    return re.sub(r"[^a-z0-9 ]", "", value.lower())


def find_crime_type(question: str) -> str | None:
    normalized = normalize_text(question)
    for crime_type in CRIME_TYPES:
        if crime_type in normalized:
            return crime_type.title()
    return None


def find_district(question: str) -> str | None:
    normalized = normalize_text(question)
    for district in DISTRICTS:
        if district in normalized:
            return district.title()
    return None


def ask_question(db: Session, question: str) -> dict[str, Any]:
    answer = "I could not interpret the question."
    data: list[dict[str, Any]] = []
    question_text = question.strip().lower()
    crime_type = find_crime_type(question)
    district = find_district(question)

    if "repeat offender" in question_text or "repeat offenders" in question_text:
        offenders = top_repeat_offenders(db, top_n=10)
        answer = f"Found {len(offenders)} repeat offenders."
        data = offenders
        return {"answer": answer, "data": data}

    if "highest" in question_text or "most" in question_text:
        if crime_type and "district" in question_text:
            rows = (
                db.query(Crime.district, func.count(Crime.id).label("count"))
                .filter(func.lower(Crime.crime_type) == crime_type.lower())
                .group_by(Crime.district)
                .order_by(func.count(Crime.id).desc())
                .limit(1)
                .all()
            )
            if rows:
                district_name, count = rows[0]
                answer = f"{district_name} has the highest number of {crime_type} cases with {count} records."
                data = [{"district": district_name, "count": int(count)}]
                return {"answer": answer, "data": data}

    if crime_type or district:
        query = db.query(Crime)
        if crime_type:
            query = query.filter(func.lower(Crime.crime_type) == crime_type.lower())
        if district:
            query = query.filter(func.lower(Crime.district) == district.lower())
        records = query.order_by(Crime.crime_date.desc()).limit(50).all()
        data = [
            {
                "crime_id": crime.crime_id,
                "crime_type": crime.crime_type,
                "district": crime.district,
                "police_station": crime.police_station,
                "crime_date": crime.crime_date.isoformat(),
                "crime_time": crime.crime_time.isoformat(),
                "severity": crime.severity,
                "status": crime.status,
            }
            for crime in records
        ]
        answer = f"Found {len(data)} {crime_type or 'crime'} records"
        if district:
            answer += f" in {district.title()}"
        answer += "."
        return {"answer": answer, "data": data}

    if "list" in question_text and "crime" in question_text:
        records = db.query(Crime).order_by(Crime.crime_date.desc()).limit(50).all()
        data = [
            {
                "crime_id": crime.crime_id,
                "crime_type": crime.crime_type,
                "district": crime.district,
                "crime_date": crime.crime_date.isoformat(),
                "severity": crime.severity,
                "status": crime.status,
            }
            for crime in records
        ]
        answer = f"Listing the most recent {len(data)} crime records."
        return {"answer": answer, "data": data}

    return {"answer": answer, "data": data}
