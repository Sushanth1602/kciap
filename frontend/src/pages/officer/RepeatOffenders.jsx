import React, { useState, useEffect } from 'react'
import { Users, Search, AlertTriangle, Shield, CheckCircle, ExternalLink, ShieldAlert } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export default function RepeatOffenders() {
  const [offenders, setOffenders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOffender, setSelectedOffender] = useState(null)

  useEffect(() => {
    fetch(`${API_BASE}/analytics/repeat-offenders`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOffenders(data)
          if (data.length > 0) {
            setSelectedOffender(data[0])
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filteredOffenders = offenders.filter((o) =>
    o.suspect_id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getRiskBadge = (score) => {
    if (score >= 12) {
      return (
        <span className="px-2 py-0.5 rounded font-bold uppercase text-[9px] bg-red-950/80 text-red-400 border border-red-900/30">
          Critical Threat
        </span>
      )
    } else if (score >= 8) {
      return (
        <span className="px-2 py-0.5 rounded font-bold uppercase text-[9px] bg-amber-950/80 text-amber-400 border border-amber-900/30">
          High Risk
        </span>
      )
    }
    return (
      <span className="px-2 py-0.5 rounded font-bold uppercase text-[9px] bg-blue-950/80 text-blue-400 border border-blue-900/30">
        Monitor Alert
      </span>
    )
  }

  return (
    <div className="space-y-6 select-none text-slate-350 text-left">
      {/* Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 w-full h-1 bg-govgold"></div>
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-govgold/10 rounded-xl text-govgold border border-govgold/20">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wide">Repeat Offenders Registry</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
              Consolidated intelligence log tracking individuals with multiple linked crimes
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Panel: Table Log */}
        <div className="lg:col-span-8 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between gap-4 border-b border-slate-850 pb-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              High-Risk Repeat Offenders
            </h3>
            
            <div className="relative w-48">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="w-3.5 h-3.5 text-slate-500" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search suspect ID..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-1.5 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-govgold placeholder:text-slate-600 font-mono"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-24 text-center text-xs font-semibold text-slate-500 uppercase tracking-widest animate-pulse">
              Compiling offender risk weights...
            </div>
          ) : filteredOffenders.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500 font-semibold uppercase">
              No matching records found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-semibold">
                <thead>
                  <tr className="border-b border-slate-850 text-[10px] text-slate-500 uppercase font-bold text-left">
                    <th className="pb-3 pl-2">Suspect ID</th>
                    <th className="pb-3 text-center">Incidents</th>
                    <th className="pb-3 text-center">Avg Severity</th>
                    <th className="pb-3 text-center">Active Cases</th>
                    <th className="pb-3 text-right pr-2">Threat Index</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {filteredOffenders.map((o) => (
                    <tr
                      key={o.suspect_id}
                      onClick={() => setSelectedOffender(o)}
                      className={`hover:bg-slate-950/40 cursor-pointer transition ${
                        selectedOffender?.suspect_id === o.suspect_id ? 'bg-slate-950/70 border-l-2 border-govgold' : ''
                      }`}
                    >
                      <td className="py-3 pl-2 text-white font-mono">{o.suspect_id}</td>
                      <td className="py-3 text-center font-mono">{o.crime_count}</td>
                      <td className="py-3 text-center font-mono text-govgold">{o.average_severity}</td>
                      <td className="py-3 text-center font-mono text-red-400">{o.open_cases}</td>
                      <td className="py-3 text-right pr-2 font-mono text-white">{o.offender_score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Panel: Intelligence Brief */}
        <div className="lg:col-span-4 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-850 pb-3 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-govgold" />
            Suspect Intelligence Brief
          </h3>

          {selectedOffender ? (
            <div className="space-y-6 text-xs text-left">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 space-y-3 font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Suspect ID:</span>
                  <span className="text-white font-bold text-sm">{selectedOffender.suspect_id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Severity average:</span>
                  <span className="text-govgold font-bold">{selectedOffender.average_severity} / 5.0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Open cases:</span>
                  <span className="text-red-400 font-bold">{selectedOffender.open_cases}</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-850 pt-2 mt-2">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">threat index score:</span>
                  <span className="text-white font-black text-base">{selectedOffender.offender_score}</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Classification Status</span>
                {getRiskBadge(selectedOffender.offender_score)}
              </div>

              <div className="space-y-3 bg-slate-950/40 p-4 border border-slate-850/60 rounded-2xl">
                <h4 className="text-[10px] text-white font-bold uppercase tracking-wider">Operational Recommendations</h4>
                <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                  Calculated threat index of <span className="text-white font-mono font-bold">{selectedOffender.offender_score}</span> indicates high recidivism probability. Recommend placing on priority surveillance beats and updating network mapping links immediately.
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => alert(`Creating APB Watchlist Alert for ${selectedOffender.suspect_id}`)}
                  className="w-full py-2 bg-red-950/50 border border-red-900/60 hover:bg-red-900/30 text-red-400 hover:text-white rounded-xl font-bold uppercase tracking-wider text-[10px] transition"
                >
                  Issue KSP Watchlist APB
                </button>
                <button
                  onClick={() => alert(`Assigning Special Investigation Unit to ${selectedOffender.suspect_id}`)}
                  className="w-full py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-350 hover:text-white rounded-xl font-bold uppercase tracking-wider text-[10px] transition"
                >
                  Assign Investigation Team
                </button>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 font-semibold uppercase text-xs">
              Select a suspect to view brief.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
