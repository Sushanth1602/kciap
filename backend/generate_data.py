from __future__ import annotations

import csv
import random
from datetime import date, datetime, timedelta
from pathlib import Path
import sys

ROOT_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT_DIR))

from .database import CSV_PATH, DB_PATH
from .database import init_db as init_database

CRIME_TYPES = [
    "Theft",
    "Vehicle Theft",
    "Burglary",
    "Murder",
    "Assault",
    "Cyber Fraud",
    "Drug Offence",
    "Kidnapping",
    "Robbery",
    "Domestic Violence",
]

DISTRICTS = [
    "Bengaluru Urban",
    "Mysuru",
    "Mangaluru",
    "Belagavi",
    "Kalaburagi",
    "Shivamogga",
    "Hubballi-Dharwad",
    "Tumakuru",
    "Ballari",
    "Vijayapura",
]

POLICE_STATIONS = {
    "Bengaluru Urban": ["Central", "Majestic", "Koramangala", "Jayanagar"],
    "Mysuru": ["Gokulam", "VV Mohalla", "Chamraj"],
    "Mangaluru": ["Pandeshwar", "Kankanady", "Boloor"],
    "Belagavi": ["Shahu Nagar", "Sammathal", "Nipani"],
    "Kalaburagi": ["Station Road", "College Road", "Shahnoor"],
    "Shivamogga": ["Nagara", "Salem", "Pinjrapole"],
    "Hubballi-Dharwad": ["Gabburda", "Bharat", "Gokul Road"],
    "Tumakuru": ["Vidyaranyapuram", "Chitradurga Road", "Temple Road"],
    "Ballari": ["Sampangi", "Karnataka", "Shantinagar"],
    "Vijayapura": ["Station", "Old City", "Nehru Road"],
}

WEAPONS = [
    "Knife",
    "Firearm",
    "None",
    "Stolen Vehicle",
    "Mobile",
    "Poison",
    "Crowbar",
    "Rope",
    "Bat",
    "Unknown",
]

MODI = [
    "Forced entry",
    "Cyber intrusion",
    "Strangulation",
    "Hit and run",
    "Pickpocketing",
    "Bribery",
    "Scam call",
    "Kidnap and ransom",
    "Home invasion",
    "Domestic quarrel",
]

STATUS = ["Open", "Investigation", "Arrested", "Closed", "Cold Case"]

DISTRICT_COORDS = {
    "Bengaluru Urban": (12.9716, 77.5946),
    "Mysuru": (12.2958, 76.6394),
    "Mangaluru": (12.9141, 74.8560),
    "Belagavi": (15.8497, 74.4977),
    "Kalaburagi": (17.3297, 76.8343),
    "Shivamogga": (13.9299, 75.5681),
    "Hubballi-Dharwad": (15.3647, 75.1239),
    "Tumakuru": (13.3419, 77.1130),
    "Ballari": (15.1394, 76.9214),
    "Vijayapura": (16.8240, 75.7100),
}

FIELDNAMES = [
    "crime_id",
    "crime_type",
    "district",
    "police_station",
    "crime_date",
    "crime_time",
    "latitude",
    "longitude",
    "suspect_id",
    "victim_id",
    "weapon_used",
    "modus_operandi",
    "severity",
    "status",
]


def random_datetime(start_date: date, end_date: date) -> tuple[str, str]:
    delta = end_date - start_date
    random_days = random.randint(0, delta.days)
    timestamp = datetime.combine(start_date + timedelta(days=random_days), datetime.min.time())
    random_seconds = random.randint(0, 86399)
    event_time = timestamp + timedelta(seconds=random_seconds)
    return event_time.date().isoformat(), event_time.time().isoformat(timespec="minutes")


def jitter_location(lat: float, lon: float) -> tuple[float, float]:
    return round(lat + random.uniform(-0.045, 0.045), 6), round(lon + random.uniform(-0.045, 0.045), 6)


def build_row(index: int) -> dict[str, str]:
    district = random.choice(DISTRICTS)
    police_station = random.choice(POLICE_STATIONS[district])
    crime_date, crime_time = random_datetime(date(2022, 1, 1), date(2025, 1, 1))
    latitude, longitude = jitter_location(*DISTRICT_COORDS[district])
    suspect_id = f"S{random.randint(1000, 4999):04d}"
    victim_id = f"V{random.randint(5000, 8999):04d}"
    return {
        "crime_id": f"CR{index:05d}",
        "crime_type": random.choice(CRIME_TYPES),
        "district": district,
        "police_station": police_station,
        "crime_date": crime_date,
        "crime_time": crime_time,
        "latitude": str(latitude),
        "longitude": str(longitude),
        "suspect_id": suspect_id,
        "victim_id": victim_id,
        "weapon_used": random.choice(WEAPONS),
        "modus_operandi": random.choice(MODI),
        "severity": str(random.randint(1, 5)),
        "status": random.choice(STATUS),
    }


def generate_records(count: int = 10000) -> None:
    DATASETS_DIR = CSV_PATH.parent
    DATASETS_DIR.mkdir(parents=True, exist_ok=True)
    with open(CSV_PATH, mode="w", newline="", encoding="utf-8") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=FIELDNAMES)
        writer.writeheader()
        for index in range(1, count + 1):
            writer.writerow(build_row(index))
    print(f"Generated {count} crime records at {CSV_PATH}")


if __name__ == "__main__":
    generate_records(10000)
    init_database()
    print(f"SQLite database initialized at {DB_PATH}")
