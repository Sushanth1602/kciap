import React, { useState, useEffect } from 'react'
import ExecutiveReports from '../../components/reports/ExecutiveReports'
import { FileText } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export default function GovernmentReports() {
  const [summary, setSummary] = useState({ total_crimes: 10000, active_cases: 7910, closed_cases: 2090, high_severity_cases: 4105 })
  const [districts, setDistricts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const [sum, dists] = await Promise.all([
          fetch(`${API_BASE}/analytics/summary`).then((r) => r.json()).catch(() => null),
          fetch(`${API_BASE}/analytics/crimes-by-district`).then((r) => r.json()).catch(() => [])
        ])
        if (sum) setSummary(sum)
        if (Array.isArray(dists)) setDistricts(dists)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  return (
    <div className="space-y-6 select-none max-w-4xl mx-auto">
      {/* Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 w-full h-1 bg-govblue"></div>
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-govblue/10 rounded-xl text-govblue border border-govblue/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-govnavy uppercase tracking-wide">Executive Intelligence Reports</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Generate, audit, and print consolidated security parameters reports</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm">
        {loading ? (
          <div className="py-12 text-center text-xs font-semibold text-slate-500 uppercase tracking-widest animate-pulse">
            Compiling audit parameters...
          </div>
        ) : (
          <ExecutiveReports summary={summary} districts={districts} />
        )}
      </div>
    </div>
  )
}
