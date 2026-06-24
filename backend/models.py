from __future__ import annotations

from datetime import datetime
from sqlalchemy import Column, Date, Integer, String, Time, Float, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

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
