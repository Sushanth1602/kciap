import React, { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export default function StatsCards() {
  const [summary, setSummary] = useState({ total_crimes: 0, active_cases: 0, closed_cases: 0, high_severity_cases: 0 })

  useEffect(() => {
    fetch(`${API_BASE}/analytics/summary`).then((r) => r.json()).then(setSummary).catch(console.error)
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="text-sm text-slate-500">Total Crimes</div>
        <div className="mt-2 text-2xl font-semibold">{summary.total_crimes}</div>
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="text-sm text-slate-500">Active Cases</div>
        <div className="mt-2 text-2xl font-semibold">{summary.active_cases}</div>
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="text-sm text-slate-500">Closed Cases</div>
        <div className="mt-2 text-2xl font-semibold">{summary.closed_cases}</div>
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="text-sm text-slate-500">High Severity</div>
        <div className="mt-2 text-2xl font-semibold">{summary.high_severity_cases}</div>
      </div>
    </div>
  )
}
