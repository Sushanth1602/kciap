from __future__ import annotations

from sqlalchemy import func, case, desc
from sqlalchemy.orm import Session

from .models import Crime


def top_repeat_offenders(db: Session, top_n: int = 20) -> list[dict[str, float]]:
    rows = (
        db.query(
            Crime.suspect_id,
            func.count(Crime.id).label("crime_count"),
            func.avg(Crime.severity).label("avg_severity"),
            func.sum(case((Crime.status != "Closed", 1), else_=0)).label("open_cases"),
        )
        .group_by(Crime.suspect_id)
        .having(func.count(Crime.id) > 1)
        .order_by(desc("crime_count"), desc("avg_severity"))
        .limit(top_n)
        .all()
    )

    offenders = []
    for suspect_id, crime_count, avg_severity, open_cases in rows:
        score = float(crime_count) * 1.8 + float(avg_severity or 0) * 1.2 + float(open_cases or 0) * 0.6
        offenders.append(
            {
                "suspect_id": suspect_id,
                "crime_count": int(crime_count),
                "average_severity": round(float(avg_severity or 0), 2),
                "open_cases": int(open_cases or 0),
                "offender_score": round(score, 2),
            }
        )
    return offenders
