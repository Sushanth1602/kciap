# Crime Intelligence & Analytical Platform

Prototype for Karnataka State Police (KSP) crime analytics and intelligence.

## Project Structure

- `backend/` - FastAPI backend, SQLAlchemy models, network analysis, analytics utilities
- `frontend/` - React + Tailwind UI, Recharts, React Leaflet map
- `datasets/` - Synthetic crime dataset CSV
- `database/` - SQLite database file
- `notebooks/` - Analytics notebooks and experiment notes
- `docs/` - Supporting project documentation

## Installation

### Backend

1. Create and activate a Python 3.11+ virtual environment.
2. Install dependencies:
   ```bash
   cd backend
   python -m pip install -r requirements.txt
   ```
3. Generate data and initialize the SQLite database:
   ```bash
   python generate_data.py
   ```
4. Start the API:
   ```bash
   uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the UI:
   ```bash
   npm run dev
   ```

## API Endpoints

- `GET /health` - Service status
- `GET /crimes` - List all crime records
- `GET /crimes/{crime_id}` - Retrieve a single crime record
- `GET /districts` - Crimes grouped by district
- `GET /crime-types` - Crimes grouped by type
- `GET /crime-trends` - Monthly crime trend data
- `GET /hotspots` - Top hotspot locations
- `GET /network/{suspect_id}` - Suspect network summary

## Notes

- The backend supports environment variables via `DATABASE_URL`.
- The frontend expects the API to be available at `http://localhost:8000` by default.
- Synthetic crime data is generated in `datasets/crime_data.csv` and loaded into `database/crime.db`.
