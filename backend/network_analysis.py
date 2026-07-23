from __future__ import annotations

from typing import Any

import networkx as nx
from sqlalchemy import or_
from sqlalchemy.orm import Session

try:
    from .models import Crime
except ImportError:
    from models import Crime


def build_suspect_network(db: Session, suspect_id: str) -> dict[str, Any]:
    crimes = db.query(Crime).filter(Crime.suspect_id == suspect_id).all()
    graph = nx.Graph()
    related_suspects = set()
    related_victims = set()
    related_locations = set()
    related_crimes = [crime.crime_id for crime in crimes]

    graph.add_node(suspect_id, type="suspect")

    for crime in crimes:
        location_node = f"location:{crime.district}"
        graph.add_node(crime.crime_id, type="crime")
        graph.add_node(crime.victim_id, type="victim")
        graph.add_node(location_node, type="location", label=crime.district)
        graph.add_edge(suspect_id, crime.crime_id, relation="committed")
        graph.add_edge(crime.crime_id, crime.victim_id, relation="victim_of")
        graph.add_edge(crime.crime_id, location_node, relation="occurred_at")
        graph.add_edge(suspect_id, crime.victim_id, relation="associated_with")
        related_victims.add(crime.victim_id)
        related_locations.add(location_node)

    if related_victims or related_locations:
        same_victim_suspects = (
            db.query(Crime.suspect_id)
            .filter(Crime.victim_id.in_(list(related_victims)), Crime.suspect_id != suspect_id)
            .distinct()
            .all()
        )
        same_location_suspects = (
            db.query(Crime.suspect_id)
            .filter(Crime.district.in_([loc.split(":", 1)[1] for loc in related_locations]), Crime.suspect_id != suspect_id)
            .distinct()
            .all()
        )
        for other, in set(same_victim_suspects + same_location_suspects):
            related_suspects.add(other)
            graph.add_node(other, type="suspect")
            graph.add_edge(suspect_id, other, relation="associated_with")

    risk_multiplier = 1.0 + len(related_suspects) * 0.25 + len(related_victims) * 0.1 + len(related_crimes) * 0.15
    severity_total = sum(crime.severity for crime in crimes)
    risk_score = round(severity_total * risk_multiplier, 2)

    nodes = [
        {"id": n, "type": graph.nodes[n].get("type", "unknown"), "label": graph.nodes[n].get("label", n)}
        for n in graph.nodes()
    ]
    edges = [
        {"source": u, "target": v, "relation": graph.edges[u, v].get("relation", "related")}
        for u, v in graph.edges()
    ]

    connected_suspects = [s for s in related_suspects]

    return {
        "suspect_id": suspect_id,
        "connected_suspects": connected_suspects,
        "related_crimes": related_crimes,
        "related_victims": list(related_victims),
        "related_locations": [loc.split(":", 1)[1] for loc in related_locations],
        "network_degree": int(graph.degree(suspect_id)),
        "risk_score": risk_score,
        "graph": {
            "nodes": nodes,
            "edges": edges,
        },
    }


def get_connected_entities(db: Session, suspect_id: str) -> dict[str, Any]:
    return build_suspect_network(db, suspect_id)
