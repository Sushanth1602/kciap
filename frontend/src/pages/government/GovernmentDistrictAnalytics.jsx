import React, { useState, useEffect, useMemo } from 'react'
import DistrictBarChart from '../../components/analytics/DistrictBarChart'
import { BarChart2, ShieldCheck, ShieldAlert, Award } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export default function GovernmentDistrictAnalytics() {
  const [districts, setDistricts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_BASE}/analytics/crimes-by-district`)
      .then((r) => r.json())
      .then((list) => {
        if (Array.isArray(list)) setDistricts(list)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const sortedPerformance = useMemo(() => {
    if (!districts.length) return { risk: [], safe: [] }
    const sorted = [...districts].sort((a, b) => b.count - a.count)
    return {
      risk: sorted.slice(0, 3),
      safe: [...sorted].reverse().slice(0, 3)
    }
  }, [districts])

  const topDistrictsBar = useMemo(() => districts.slice(0, 5), [districts])

  return (
    <div className="space-y-8 select-none">
      {/* Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 w-full h-1 bg-govblue"></div>
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-govblue/10 rounded-xl text-govblue border border-govblue/20">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-govnavy uppercase tracking-wide">Regional District Safety Audits</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Statistical ranks computed dynamically from database case reports</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs font-semibold text-slate-500 uppercase tracking-widest animate-pulse">
          Analyzing regional charts...
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-12 items-start">
          {/* Safe vs Risk list */}
          <div className="md:col-span-4 space-y-6">
            {/* Dangerous */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
              <span className="text-[10px] text-red-650 font-bold uppercase tracking-wider flex items-center gap-1">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                Top High Incident Divisions
              </span>
              <div className="space-y-2 text-xs">
                {sortedPerformance.risk.map((dist, idx) => (
                  <div key={dist.district} className="flex justify-between items-center bg-red-50/40 border border-red-100 p-2.5 rounded-xl">
                    <strong className="text-govnavy font-bold">{idx + 1}. {dist.district}</strong>
                    <span className="text-red-700 font-bold font-mono">{dist.count} cases</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Safe */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
              <span className="text-[10px] text-green-705 font-bold uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-green-650" />
                Top Low Incident Divisions
              </span>
              <div className="space-y-2 text-xs">
                {sortedPerformance.safe.map((dist, idx) => (
                  <div key={dist.district} className="flex justify-between items-center bg-green-50/40 border border-green-100 p-2.5 rounded-xl">
                    <strong className="text-govnavy font-bold">{idx + 1}. {dist.district}</strong>
                    <span className="text-green-700 font-bold font-mono">{dist.count} cases</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="md:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-govnavy uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <Award className="w-4 h-4 text-govgold" />
              Incidents Volume Breakdown by Division
            </h3>
            <DistrictBarChart data={topDistrictsBar} />
          </div>
        </div>
      )}
    </div>
  )
}
