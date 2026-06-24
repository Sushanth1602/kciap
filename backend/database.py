from __future__ import annotations

import csv
import os
from pathlib import Path
from typing import Generator
from datetime import date, time, datetime

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from .models import Base, Crime, Suspect, Victim, Profile, Officer, Citizen, Complaint, CrimeReport, AnalyticsMetric, Notification

ROOT_DIR = Path(__file__).resolve().parents[1]
DATASETS_DIR = ROOT_DIR / "datasets"
DATABASE_DIR = ROOT_DIR / "database"
DATABASE_DIR.mkdir(parents=True, exist_ok=True)
CSV_PATH = DATASETS_DIR / "crime_data.csv"
DB_PATH = DATABASE_DIR / "crime.db"
DATABASE_URL = os.environ.get("DATABASE_URL", f"sqlite:///{DB_PATH}")

# cross-compatibility engine creation
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    # Ensure all tables are created on PostgreSQL/Supabase
    if not DATABASE_URL.startswith("sqlite"):
        Base.metadata.create_all(bind=engine)
        return

    if DB_PATH.exists() and DB_PATH.stat().st_size > 0:
        return

    Base.metadata.create_all(bind=engine)
    if not CSV_PATH.exists():
        raise FileNotFoundError(f"Dataset not found at {CSV_PATH}")

    with open(CSV_PATH, newline="", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)
        suspects: dict[str, Suspect] = {}
        victims: dict[str, Victim] = {}
        with SessionLocal() as session:
            for row in reader:
                suspect_id = row["suspect_id"]
                victim_id = row["victim_id"]
                if suspect_id not in suspects:
                    suspects[suspect_id] = Suspect(
                        suspect_id=suspect_id,
                        name=f"Suspect {suspect_id}",
                        age=int(row.get("suspect_age", 30)) if row.get("suspect_age") else 30,
                        gender=row.get("suspect_gender", "Unknown"),
                    )
                    session.add(suspects[suspect_id])
                if victim_id not in victims:
                    victims[victim_id] = Victim(
                        victim_id=victim_id,
                        name=f"Victim {victim_id}",
                        age=int(row.get("victim_age", 28)) if row.get("victim_age") else 28,
                        gender=row.get("victim_gender", "Unknown"),
                    )
                    session.add(victims[victim_id])

            session.commit()

            csvfile.seek(0)
            reader = csv.DictReader(csvfile)
            for row in reader:
                crime = Crime(
                    crime_id=row["crime_id"],
                    crime_type=row["crime_type"],
                    district=row["district"],
                    police_station=row["police_station"],
                    crime_date=datetime.fromisoformat(row["crime_date"]).date(),
                    crime_time=datetime.strptime(
                        row["crime_time"],
                        "%H:%M"
                    ).time(),
                    latitude=float(row["latitude"]),
                    longitude=float(row["longitude"]),
                    suspect_id=row["suspect_id"],
                    victim_id=row["victim_id"],
                    weapon_used=row["weapon_used"],
                    modus_operandi=row["modus_operandi"],
                    severity=int(row["severity"]),
                    status=row["status"],
                )
                session.add(crime)
            session.commit()
