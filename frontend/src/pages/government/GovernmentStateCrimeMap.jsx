import React, { useState, useEffect } from 'react'
import HeroMap from '../../components/maps/HeroMap'
import { Map, Info } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export default function GovernmentStateCrimeMap() {
  const [districts, setDistricts] = useState([])
  const [hotspots, setHotspots] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadMapData() {
      try {
        const [districtsRes, hotspotsRes] = await Promise.all([
          fetch(`${API_BASE}/analytics/crimes-by-district`).then((res) => res.json()).catch(() => []),
          fetch(`${API_BASE}/analytics/hotspots`).then((res) => res.json()).catch(() => ({ hotspots: [] })),
        ])
        if (Array.isArray(districtsRes)) setDistricts(districtsRes)
        if (hotspotsRes && Array.isArray(hotspotsRes.hotspots)) setHotspots(hotspotsRes.hotspots)
      } catch (error) {
        console.error("Failed to load map statistics:", error)
      } finally {
        setLoading(false)
      }
    }
    loadMapData()
  }, [])

  return (
    <div className="space-y-6 select-none">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 w-full h-1 bg-govblue"></div>
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-govblue/10 rounded-xl text-govblue border border-govblue/20">
            <Map className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-govnavy uppercase tracking-wide">Karnataka State Threat Risk Map</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Colors display risk scale based on consolidated case count</p>
          </div>
        </div>
      </div>

      <div className="h-[520px] rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative">
        {loading ? (
          <div className="absolute inset-0 bg-slate-50 flex items-center justify-center text-xs font-semibold text-slate-500 uppercase tracking-widest animate-pulse">
            Compiling risk parameters...
          </div>
        ) : (
          <HeroMap hotspots={hotspots} districtStats={districts} riskColored={true} />
        )}
      </div>

      <div className="bg-blue-50 border border-blue-105 p-4 rounded-2xl flex items-start gap-2.5 text-[10px] text-blue-750 font-bold leading-normal">
        <Info className="w-4 h-4 text-blue-650 flex-shrink-0 mt-0.5" />
        <p>Threat coloring metrics key: Green (Low Risk, &lt; 15 incidents); Yellow (Medium Risk, 15 to 49 incidents); Red (High Risk, &ge; 50 incidents).</p>
      </div>
    </div>
  )
}
