import React, { useState, useEffect } from 'react'
import HotspotTable from '../../components/analytics/HotspotTable'
import { AlertCircle } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export default function OfficerHotspots() {
  const [hotspots, setHotspots] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_BASE}/analytics/hotspots`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.hotspots)) setHotspots(data.hotspots)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6 select-none text-slate-350">
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 w-full h-1 bg-govgold"></div>
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-govgold/10 rounded-xl text-govgold border border-govgold/20">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wide">Threat Risk Clusters</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">High incident clustering points calculated in real-time</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden p-4">
        {loading ? (
          <div className="py-12 text-center text-xs font-semibold text-slate-500 uppercase tracking-widest animate-pulse">
            Analyzing density clusters...
          </div>
        ) : (
          <HotspotTable hotspots={hotspots} />
        )}
      </div>
    </div>
  )
}
