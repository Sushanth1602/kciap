import React, { useEffect, useMemo, useState } from 'react'
import KpiCard from '../components/KpiCard'
import CrimeTrendChart from '../components/CrimeTrendChart'
import CrimeTypePieChart from '../components/CrimeTypePieChart'
import DistrictBarChart from '../components/DistrictBarChart'
import CrimeMap from '../components/CrimeMap'
import NetworkAnalysis from '../components/NetworkAnalysis'
import AiAssistant from '../components/AiAssistant'
import HotspotTable from '../components/HotspotTable'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export default function GovernmentPortal() {
  const [stats, setStats] = useState({ districts: [], crimeTypes: [], trends: [], hotspots: [] })
  const [crimeList, setCrimeList] = useState([])
  const [summary, setSummary] = useState({ total_crimes: 0, active_cases: 0, closed_cases: 0, high_severity_cases: 0 })

  useEffect(() => {
    async function loadData() {
      const [summaryRes, districts, crimeTypes, trends, hotspots, crimes] = await Promise.all([
        fetch(`${API_BASE}/analytics/summary`).then((res) => res.json()),
        fetch(`${API_BASE}/analytics/crimes-by-district`).then((res) => res.json()),
        fetch(`${API_BASE}/analytics/crimes-by-type`).then((res) => res.json()),
        fetch(`${API_BASE}/analytics/monthly-trends`).then((res) => res.json()),
        fetch(`${API_BASE}/analytics/hotspots`).then((res) => res.json()),
        fetch(`${API_BASE}/crimes`).then((res) => res.json()),
      ])

      setSummary(summaryRes)
      setStats({ districts, crimeTypes, trends, hotspots: hotspots.hotspots || [] })
      setCrimeList(crimes)
    }

    loadData().catch(console.error)
  }, [])

  const topDistricts = useMemo(() => stats.districts.slice(0, 5), [stats.districts])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard title="Total Crimes" value={summary.total_crimes} />
        <KpiCard title="Active Cases" value={summary.active_cases} />
        <KpiCard title="Closed Cases" value={summary.closed_cases} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard title="High Severity Cases" value={summary.high_severity_cases} />
        <KpiCard title="Crime Types" value={stats.crimeTypes.length} />
        <KpiCard title="Districts" value={stats.districts.length} />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Monthly Trend</h2>
          <CrimeTrendChart data={stats.trends} />
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Crime Types</h2>
          <CrimeTypePieChart data={stats.crimeTypes} />
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Top Districts</h2>
          <DistrictBarChart data={topDistricts} />
        </div>
      </div>

      <HotspotTable hotspots={stats.hotspots} />

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Recent Crime Records</h2>
        <div className="max-h-96 overflow-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="border-b px-3 py-2">Crime ID</th>
                <th className="border-b px-3 py-2">Type</th>
                <th className="border-b px-3 py-2">District</th>
                <th className="border-b px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {crimeList.slice(0, 10).map((crime) => (
                <tr key={crime.crime_id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-3 py-2">{crime.crime_id}</td>
                  <td className="px-3 py-2">{crime.crime_type}</td>
                  <td className="px-3 py-2">{crime.district}</td>
                  <td className="px-3 py-2">{crime.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <CrimeMap crimes={crimeList} hotspots={stats.hotspots} />
        <div>
          <NetworkAnalysis apiBase={API_BASE} />
          <div className="mt-4">
            <AiAssistant apiBase={API_BASE} />
          </div>
        </div>
      </div>
    </div>
  )
}
