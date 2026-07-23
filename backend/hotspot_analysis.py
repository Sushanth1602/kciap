from __future__ import annotations

import numpy as np
from sklearn.cluster import DBSCAN
from sqlalchemy.orm import Session

try:
    from .models import Crime
except ImportError:
    from models import Crime


def detect_hotspots(db: Session, eps: float = 0.04, min_samples: int = 6) -> dict[str, list[dict[str, float]]]:
    locations = db.query(Crime.latitude, Crime.longitude).filter(Crime.latitude.isnot(None), Crime.longitude.isnot(None)).all()
    if not locations:
        return {"hotspots": []}

    coords = np.array(locations, dtype=float)
    if coords.shape[0] == 0:
        return {"hotspots": []}

    clusterer = DBSCAN(eps=eps, min_samples=min_samples, metric="euclidean")
    labels = clusterer.fit_predict(coords)
    hotspot_data: dict[int, list[tuple[float, float]]] = {}
    for label, (lat, lon) in zip(labels, coords):
        if label == -1:
            continue
        hotspot_data.setdefault(int(label), []).append((float(lat), float(lon)))

    hotspots = []
    for cluster_id, points in hotspot_data.items():
        latitudes = [point[0] for point in points]
        longitudes = [point[1] for point in points]
        hotspots.append(
            {
                "cluster_id": int(cluster_id),
                "crime_count": len(points),
                "center_lat": float(np.mean(latitudes)),
                "center_lon": float(np.mean(longitudes)),
            }
        )

    hotspots.sort(key=lambda item: item["crime_count"], reverse=True)
    return {"hotspots": hotspots}
