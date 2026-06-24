import React from 'react'
import NetworkAnalysis from '../../components/analytics/NetworkAnalysis'
import { Link2 } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export default function OfficerNetworkAnalysis() {
  return (
    <div className="space-y-6 select-none text-slate-350">
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 w-full h-1 bg-govgold"></div>
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-govgold/10 rounded-xl text-govgold border border-govgold/20">
            <Link2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wide">Link Analysis Workspace</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Explore suspect, victim, and case connections</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4">
        <NetworkAnalysis apiBase={API_BASE} />
      </div>
    </div>
  )
}
