# Crime Intelligence & Analytical Platform

Prototype for Karnataka State Police (KSP) crime analytics and intelligence.

## Project Structure

- `backend/` - FastAPI backend, SQLAlchemy models, network analysis, analytics utilities
- `frontend/` - React + Tailwind UI, Recharts, React Leaflet map
- `datasets/` - Synthetic crime dataset CSV
- `database/` - SQLite database file
- `notebooks/` - Analytics notebooks and experiment notes
- `docs/` - Supporting project documentation

## Quick Start (Run Both Frontend & Backend with 1 Command)

From the project root directory (`kciap`), run:

```bash
npm start
```
*(or `npm run dev`)*

This concurrently starts both:
- **Backend API**: `http://127.0.0.1:8000`
- **Frontend UI**: `http://localhost:5173`

---

## Running Services Individually

### Backend

1. Install backend dependencies (if not already installed):
   ```bash
   python -m pip install -r backend/requirements.txt
   ```
2. Start the FastAPI backend:
   ```bash
   npm run backend
   # Or directly:
   python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
   ```

### Frontend

1. Install frontend dependencies:
   ```bash
   npm install --prefix frontend
   ```
2. Start the Vite UI:
   ```bash
   npm run frontend
   # Or directly:
   npm run dev --prefix frontend
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
