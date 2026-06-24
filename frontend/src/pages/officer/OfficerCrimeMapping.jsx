import React, { useState, useEffect } from 'react'
import CrimeMap from '../../components/maps/CrimeMap'
import { Map, Info } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export default function OfficerCrimeMapping() {
  const [crimes, setCrimes] = useState([])
  const [hotspots, setHotspots] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [crimesRes, hotspotsRes] = await Promise.all([
          fetch(`${API_BASE}/crimes`).then((r) => r.json()).catch(() => []),
          fetch(`${API_BASE}/analytics/hotspots`).then((r) => r.json()).catch(() => ({ hotspots: [] }))
        ])
        if (Array.isArray(crimesRes)) setCrimes(crimesRes)
        if (hotspotsRes && Array.isArray(hotspotsRes.hotspots)) setHotspots(hotspotsRes.hotspots)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <div className="space-y-6 select-none text-slate-350">
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 w-full h-1 bg-govgold"></div>
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-govgold/10 rounded-xl text-govgold border border-govgold/20">
            <Map className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wide">Tactical Crime Map</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Geographical coordinates analysis and incident layers</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/40">
        {loading ? (
          <div className="py-24 text-center text-xs font-semibold text-slate-500 uppercase tracking-widest animate-pulse">
            Compiling geographic coordinates...
          </div>
        ) : (
          <CrimeMap crimes={crimes} hotspots={hotspots} />
        )}
      </div>

      <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-2xl flex items-start gap-2.5 text-[10px] text-slate-405 font-bold leading-normal">
        <Info className="w-4 h-4 text-govgold flex-shrink-0 mt-0.5" />
        <p>This map interface displays active crime reports and hotspots coordinates. Access is protected and monitored under KSP Information Security guidelines.</p>
      </div>
    </div>
  )
}
