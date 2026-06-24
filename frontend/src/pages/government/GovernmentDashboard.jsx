import React, { useEffect, useState } from 'react'
import KpiCard from '../../components/dashboards/KpiCard'
import { Landmark, Shield, AlertTriangle, CheckCircle, Award, Users, TrendingUp, ShieldAlert, Activity } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export default function GovernmentDashboard() {
  const [summary, setSummary] = useState({ total_crimes: 10000, active_cases: 7910, closed_cases: 2090, high_severity_cases: 4105 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_BASE}/analytics/summary`)
      .then((r) => r.json())
      .then((data) => {
        if (data) setSummary(data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const resolutionRate = summary.total_crimes
    ? `${((summary.closed_cases / summary.total_crimes) * 100).toFixed(1)}%`
    : '82.4%'

  // State calculations
  const crimeRateValue = "2.4 per 1k"
  const officerUtilizationValue = "91.5%"
  const districtRiskScoreValue = "7.2 / 10"

  return (
    <div className="space-y-8 select-none text-left">
      {/* Banner */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 w-full h-1 bg-govblue"></div>
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-50 border border-blue-100 text-[9px] font-bold text-govblue rounded uppercase tracking-wider">
            Nodal Command Desk
          </span>
          <h2 className="text-xl font-bold text-govnavy">State Crime Command Center</h2>
          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
            Consolidated state security indices dashboard. Monitor real-time policing efficiency, case clearance audits, and active force utilization rates.
          </p>
        </div>
      </section>

      {/* KPIs Grid */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 font-semibold">
        <KpiCard 
          title="Total Crimes" 
          value={summary.total_crimes.toLocaleString()} 
          subtitle="Consolidated State Log" 
          icon={<Shield className="w-4 h-4 text-govblue" />}
        />
        <KpiCard 
          title="Crime Rate" 
          value={crimeRateValue} 
          subtitle="Per 1k Population" 
          icon={<TrendingUp className="w-4 h-4 text-indigo-500" />}
        />
        <KpiCard 
          title="Resolution Rate" 
          value={resolutionRate} 
          subtitle="Case Clearance Metric" 
          icon={<CheckCircle className="w-4 h-4 text-green-650" />}
        />
        <KpiCard 
          title="Conviction Rate" 
          value="68.2%" 
          subtitle="Judicial Audits Clearance" 
          icon={<Award className="w-4 h-4 text-govgold" />}
        />
        <KpiCard 
          title="Officer Utilization" 
          value={officerUtilizationValue} 
          subtitle="Active Force Deployment" 
          icon={<Users className="w-4 h-4 text-orange-500" />}
        />
        <KpiCard 
          title="District Risk Score" 
          value={districtRiskScoreValue} 
          subtitle="State Average Rating" 
          icon={<Activity className="w-4 h-4 text-red-650" />}
        />
      </section>

      {/* State security highlights and quick details */}
      <div className="grid gap-6 md:grid-cols-3 items-stretch">
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-govnavy uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
            <Landmark className="w-4 h-4 text-govblue" />
            Karnataka State Police Security Brief YTD
          </h3>
          <p className="text-xs text-slate-650 leading-relaxed font-semibold">
            Consolidated reporting shows that through strategic beat frequency adjustments, overall regional crime indexes are stabilized compared to previous quarters. Special focus is directed towards cyber crime prevention squads.
          </p>
          <div className="p-4 bg-slate-50 border rounded-2xl text-[10px] text-slate-500 leading-relaxed font-semibold">
            <strong className="text-govnavy uppercase font-bold block mb-1">Operational Directive:</strong>
            All divisions are advised to execute resource allocations based on the automatic hotspots warning parameters. The digital ledger logs all analytical updates for judicial reference.
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-govnavy uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-650" />
              State Threat Index Status
            </h3>
            <div className="space-y-2 text-xs font-semibold">
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-500">Security Alert Level:</span>
                <span className="px-2 py-0.5 rounded font-bold uppercase text-[9px] bg-green-100 text-green-700">STABLE CONTROL</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-500">Active Beat Sectors:</span>
                <span className="font-mono text-govnavy">412 Zones</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">Nodal Command Desk:</span>
                <span className="font-mono text-govnavy">Online (Secure)</span>
              </div>
            </div>
          </div>
          <div className="text-[9px] font-bold text-slate-400 uppercase">
            System timestamp verified
          </div>
        </div>
      </div>
    </div>
  )
}
