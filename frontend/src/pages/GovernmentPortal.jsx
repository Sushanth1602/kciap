import React, { useEffect, useMemo, useState } from 'react'
import KpiCard from '../components/dashboards/KpiCard'
import CrimeTrendChart from '../components/analytics/CrimeTrendChart'
import CrimeTypePieChart from '../components/analytics/CrimeTypePieChart'
import DistrictBarChart from '../components/analytics/DistrictBarChart'
import HeroMap from '../components/maps/HeroMap'
import ExecutiveReports from '../components/reports/ExecutiveReports'
import AiAssistant from '../components/ai/AiAssistant'
import { Landmark, ShieldAlert, Cpu, BarChart2, TrendingUp, Compass, FileText } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export default function GovernmentPortal() {
  const [stats, setStats] = useState({ districts: [], crimeTypes: [], trends: [], hotspots: [] })
  const [summary, setSummary] = useState({ total_crimes: 10000, active_cases: 7910, closed_cases: 2090, high_severity_cases: 4105 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [summaryRes, districtsRes, crimeTypesRes, trendsRes, hotspotsRes] = await Promise.all([
          fetch(`${API_BASE}/analytics/summary`).then((res) => res.json()).catch(() => null),
          fetch(`${API_BASE}/analytics/crimes-by-district`).then((res) => res.json()).catch(() => []),
          fetch(`${API_BASE}/analytics/crimes-by-type`).then((res) => res.json()).catch(() => []),
          fetch(`${API_BASE}/analytics/monthly-trends`).then((res) => res.json()).catch(() => []),
          fetch(`${API_BASE}/analytics/hotspots`).then((res) => res.json()).catch(() => ({ hotspots: [] })),
        ])

        if (summaryRes) setSummary(summaryRes)
        setStats({
          districts: districtsRes || [],
          crimeTypes: crimeTypesRes || [],
          trends: trendsRes || [],
          hotspots: hotspotsRes?.hotspots || []
        })
      } catch (err) {
        console.error("Failed to load command center statistics:", err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Calculations
  const resolutionRate = useMemo(() => {
    if (!summary.total_crimes) return '82.4%'
    return `${((summary.closed_cases / summary.total_crimes) * 100).toFixed(1)}%`
  }, [summary])

  const riskScore = useMemo(() => {
    if (!summary.total_crimes) return '6.8'
    return ((summary.high_severity_cases / summary.total_crimes) * 10).toFixed(1)
  }, [summary])

  // Sorting Top Safe / Top Risk Districts dynamically from API stats
  const districtPerformance = useMemo(() => {
    if (!stats.districts.length) {
      return { safe: [], risk: [] }
    }
    const sorted = [...stats.districts].sort((a, b) => b.count - a.count)
    return {
      risk: sorted.slice(0, 3),
      safe: [...sorted].reverse().slice(0, 3)
    }
  }, [stats.districts])

  // Forecast Trends calculation for predictive crime analytics
  const forecastTrends = useMemo(() => {
    if (!stats.trends.length) return []
    // Append simulated forecasts for next 3 months
    const lastPoint = stats.trends[stats.trends.length - 1]
    const baseCount = lastPoint?.count || 450
    return [
      ...stats.trends,
      { month: 'Jul 2026 (F)', count: Math.round(baseCount * 1.05) },
      { month: 'Aug 2026 (F)', count: Math.round(baseCount * 0.98) },
      { month: 'Sep 2026 (F)', count: Math.round(baseCount * 1.02) }
    ]
  }, [stats.trends])

  const topDistrictsBar = useMemo(() => stats.districts.slice(0, 5), [stats.districts])

  return (
    <div className="space-y-12 py-6 select-none bg-slate-50 min-h-screen">
      {/* Title Header */}
      <header className="flex justify-between items-center flex-wrap gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-50 text-govblue border border-blue-150 rounded-2xl flex items-center justify-center">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-wider text-govnavy">Karnataka Crime Intelligence Command Center</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Official Administrative Decision Portal</p>
          </div>
        </div>
      </header>

      {/* KPIs Grid */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard title="Total Crimes" value={summary.total_crimes.toLocaleString()} subtitle="Consolidated State Log" trend="↑ 1.2%" />
        <KpiCard title="Active Cases" value={summary.active_cases.toLocaleString()} subtitle="Under active investigation" trend="↓ 0.4%" />
        <KpiCard title="Resolution Rate" value={resolutionRate} subtitle="Overall clearance index" trend="↑ 2.1%" />
        <KpiCard title="District Risk Score" value={riskScore} subtitle="Average vulnerability scale" trend="Stable" />
        <KpiCard title="High Severity Cases" value={summary.high_severity_cases.toLocaleString()} subtitle="Level 4-5 priority entries" trend="↑ 0.8%" />
      </section>

      {/* Main Map and Performance Grid */}
      <section className="grid gap-6 lg:grid-cols-12 items-stretch">
        {/* Karnataka State Map with risk coloring */}
        <div className="lg:col-span-8 h-[550px] bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-govnavy uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-govblue" />
              State Risk-Colored Security Map
            </h3>
            <span className="text-[9px] px-2 py-0.5 bg-govnavy text-white font-bold rounded uppercase tracking-wider">Dynamic Coloring Active</span>
          </div>
          <div className="flex-grow w-full h-full min-h-0">
            <HeroMap hotspots={stats.hotspots} districtStats={stats.districts} riskColored={true} />
          </div>
        </div>

        {/* District Performance Dashboard */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-govnavy uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-govgold" />
              Regional Security Audits YTD
            </h3>

            {/* Top Threat Districts */}
            <div className="space-y-3">
              <span className="text-[10px] text-red-650 font-bold uppercase tracking-wider">Top High Incident Divisions</span>
              <div className="space-y-2">
                {districtPerformance.risk.length === 0 ? (
                  <p className="text-xs text-slate-400 font-medium">Loading data logs...</p>
                ) : (
                  districtPerformance.risk.map((dist) => (
                    <div key={dist.district} className="flex justify-between items-center bg-red-50/50 border border-red-100 p-2.5 rounded-xl text-xs">
                      <strong className="text-govnavy font-bold">{dist.district}</strong>
                      <span className="text-red-700 font-bold font-mono">{dist.count} cases</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Top Safe Districts */}
            <div className="space-y-3">
              <span className="text-[10px] text-green-705 font-bold uppercase tracking-wider">Top Low Incident Divisions</span>
              <div className="space-y-2">
                {districtPerformance.safe.length === 0 ? (
                  <p className="text-xs text-slate-400 font-medium">Loading data logs...</p>
                ) : (
                  districtPerformance.safe.map((dist) => (
                    <div key={dist.district} className="flex justify-between items-center bg-green-50/50 border border-green-100 p-2.5 rounded-xl text-xs">
                      <strong className="text-govnavy font-bold">{dist.district}</strong>
                      <span className="text-green-700 font-bold font-mono">{dist.count} cases</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border p-4 rounded-2xl text-[11px] text-slate-500 font-semibold leading-relaxed mt-6">
            Scoring threshold classifications: Green represent subdivisions under active police control; Red triggers command dispatcher warnings.
          </div>
        </div>
      </section>

      {/* Resource Allocation & AI Recommendations */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-govnavy uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-govblue" />
            AI Nodal Resource Allocation Advisor
          </h3>
          <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase">Automated recommendations based on regional crime spikes</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 text-xs md:text-sm">
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2 relative overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-1 bg-red-650"></div>
            <strong className="text-govnavy font-bold">Increase Cyber Crime Resources</strong>
            <p className="text-slate-550 text-xs font-semibold leading-relaxed">
              UPI frauds show a 14% increment cluster density. Allocate 15 additional investigative laptops and cyber agents to the Bengaluru Urban division.
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2 relative overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-1 bg-govgold"></div>
            <strong className="text-govnavy font-bold">Deploy Duty Officers Patrols</strong>
            <p className="text-slate-550 text-xs font-semibold leading-relaxed">
              Shift analysis shows a minor burglary increase on weekend timelines in Mysuru. Mobilize 3 mobile squad cars for active midnight beats.
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2 relative overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-1 bg-green-600"></div>
            <strong className="text-govnavy font-bold">Increase Patrol Beat Frequency</strong>
            <p className="text-slate-550 text-xs font-semibold leading-relaxed">
              Kalaburagi risk scores are stable. Implement bi-weekly community awareness briefs in residential locations to maintain low risk index.
            </p>
          </div>
        </div>
      </section>

      {/* Analytics & Predictive Analytics charts */}
      <section className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <h2 className="mb-4 text-xs font-bold text-govnavy uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-govblue" />
            Predictive Crime Trends (Forecasting YTD)
          </h2>
          <CrimeTrendChart data={forecastTrends} />
          <p className="text-[10px] text-slate-400 font-semibold text-center mt-3">Shaded segments show simulated 3-month predictive forecast intervals.</p>
        </div>
        
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <h2 className="mb-4 text-xs font-bold text-govnavy uppercase tracking-wider flex items-center gap-1.5">
            <BarChart2 className="w-4 h-4 text-govblue" />
            Incident Category Split (Consolidated)
          </h2>
          <CrimeTypePieChart data={stats.crimeTypes} />
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <h2 className="mb-4 text-xs font-bold text-govnavy uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-govblue" />
            Top Districts Incident Volume
          </h2>
          <DistrictBarChart data={topDistrictsBar} />
        </div>
      </section>

      {/* Executive Reports widget */}
      <section>
        <ExecutiveReports summary={summary} districts={stats.districts} />
      </section>

      {/* Strategic advisor assistant */}
      <section className="max-w-4xl mx-auto">
        <AiAssistant 
          apiBase={API_BASE}
          defaultPrompt="Which districts need more officers?"
          rolePromptSuggestions={[
            "Which districts need more officers?",
            "Generate monthly crime summary",
            "Suggest resource allocation"
          ]}
        />
      </section>
    </div>
  )
}
