import React from 'react'
import { AlertCircle } from 'lucide-react'

function HotspotTable({ hotspots }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
      <h2 className="mb-4 text-lg font-bold text-govnavy uppercase tracking-wide border-l-4 border-govgold pl-3 flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-red-600" />
        Hotspot Clusters (Active High Density)
      </h2>
      <div className="max-h-80 overflow-auto border border-slate-150 rounded-2xl">
        <table className="w-full border-collapse text-left text-xs md:text-sm">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="border-b px-4 py-3">Cluster ID</th>
              <th className="border-b px-4 py-3">Crime Count (Density)</th>
              <th className="border-b px-4 py-3">Center Latitude</th>
              <th className="border-b px-4 py-3">Center Longitude</th>
              <th className="border-b px-4 py-3">Risk Assessment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {hotspots.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-slate-400 font-medium">No active hotspot cluster density points found.</td>
              </tr>
            ) : (
              hotspots.map((spot) => {
                const isHighRisk = spot.crime_count >= 15
                return (
                  <tr key={spot.cluster_id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3.5 font-bold text-govnavy">#CL-{spot.cluster_id}</td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800">{spot.crime_count} cases</td>
                    <td className="px-4 py-3.5 text-slate-600 font-mono">{spot.center_lat.toFixed(5)}</td>
                    <td className="px-4 py-3.5 text-slate-600 font-mono">{spot.center_lon.toFixed(5)}</td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isHighRisk ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {isHighRisk ? 'Critical Threat' : 'Elevated Risk'}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default HotspotTable
