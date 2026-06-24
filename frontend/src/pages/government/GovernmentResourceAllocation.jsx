import React, { useState } from 'react'
import { Cpu, Shield, AlertTriangle, CheckCircle, Plus, Users, Send } from 'lucide-react'

export default function GovernmentResourceAllocation() {
  const [recommendations, setRecommendations] = useState([
    {
      id: 1,
      title: 'Deploy 25 Additional Officers to Bengaluru South',
      sector: 'Bengaluru South Command',
      reason: 'Robbery incidents increased 14% over the last 30 days based on active FIR logs.',
      confidence: '94.6%',
      actionLabel: 'Authorize Deployment',
      status: 'PENDING'
    },
    {
      id: 2,
      title: 'Increase Cybercrime Prevention Budget in Mysuru District',
      sector: 'Mysuru Division',
      reason: 'UPI financial scams increased 18% in municipal zones. Requires technical tools upgrades.',
      confidence: '89.2%',
      actionLabel: 'Allocate Budget Funds',
      status: 'PENDING'
    },
    {
      id: 3,
      title: 'Deploy 4 Mobile Interceptor Beats to Hubballi Core',
      sector: 'Hubballi Division',
      reason: 'Vehicle thefts showing elevated midnight clustering density. Pre-emptive patrol recommendation.',
      confidence: '87.5%',
      actionLabel: 'Deploy Interceptors',
      status: 'PENDING'
    }
  ])

  const handleAction = (id) => {
    setRecommendations((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, status: 'AUTHORIZED' } : rec))
    )
  }

  const districtResources = [
    { name: 'Bengaluru Urban', officers: 4250, vehicles: 120, budget: '₹14.2 Cr', risk: 'HIGH' },
    { name: 'Mysuru', officers: 1240, vehicles: 45, budget: '₹5.8 Cr', risk: 'MEDIUM' },
    { name: 'Hubballi-Dharwad', officers: 980, vehicles: 35, budget: '₹4.2 Cr', risk: 'MEDIUM' },
    { name: 'Mangaluru', officers: 850, vehicles: 30, budget: '₹3.9 Cr', risk: 'LOW' },
    { name: 'Belagavi', officers: 780, vehicles: 28, budget: '₹3.1 Cr', risk: 'LOW' }
  ]

  return (
    <div className="space-y-6 select-none text-left">
      {/* Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 w-full h-1 bg-govblue"></div>
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-govblue/10 rounded-xl text-govblue border border-govblue/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-govnavy uppercase tracking-wide">Resource Allocation Planner</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
              AI Recommendations based on regional crime spikes & force deployment indices
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left: AI recommendations list */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-xs font-bold text-govnavy uppercase tracking-wider border-b pb-2 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-govblue animate-pulse" />
            Active AI Recommendations
          </h3>

          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden transition hover:shadow duration-150"
              >
                <div className="absolute left-0 top-0 h-full w-1 bg-govblue"></div>
                
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] px-2 py-0.5 bg-blue-50 text-govblue rounded border font-bold uppercase tracking-wider">
                      {rec.sector}
                    </span>
                    <h4 className="text-xs font-bold text-govnavy mt-1.5 leading-normal">{rec.title}</h4>
                    <p className="text-[11px] text-slate-500 font-semibold leading-relaxed mt-1">
                      <strong className="text-govnavy uppercase text-[9px] block">Reason:</strong>
                      {rec.reason}
                    </p>
                  </div>
                  <div className="text-right shrink-0 font-mono">
                    <span className="text-[9px] text-slate-400 font-bold block uppercase">Confidence</span>
                    <span className="text-xs font-bold text-green-700">{rec.confidence}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-slate-100 pt-3 mt-3">
                  <span className="text-[9px] text-slate-400 font-bold uppercase font-mono">
                    Status: {rec.status}
                  </span>
                  {rec.status === 'PENDING' ? (
                    <button
                      onClick={() => handleAction(rec.id)}
                      className="px-3.5 py-1.5 bg-govblue hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition shadow-sm"
                    >
                      {rec.actionLabel}
                    </button>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 font-mono">
                      <CheckCircle className="w-4 h-4" />
                      AUTHORIZED
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: State Force Registry Table */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-govnavy uppercase tracking-wider border-b pb-2 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-govblue" />
            State Force Registry Table
          </h3>

          <div className="overflow-x-auto border border-slate-150 rounded-2xl">
            <table className="w-full text-xs font-semibold">
              <thead className="bg-slate-50 border-b text-[9px] text-slate-500 uppercase font-bold text-left">
                <tr>
                  <th className="py-2.5 px-3">Division</th>
                  <th className="py-2.5 px-3 text-right">Officers</th>
                  <th className="py-2.5 px-3 text-right">Budget</th>
                  <th className="py-2.5 px-3 text-center">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-650">
                {districtResources.map((dist) => (
                  <tr key={dist.name} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-bold text-govnavy">{dist.name}</td>
                    <td className="py-2.5 px-3 text-right font-mono">{dist.officers}</td>
                    <td className="py-2.5 px-3 text-right font-mono">{dist.budget}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase font-mono ${
                          dist.risk === 'HIGH'
                            ? 'bg-red-100 text-red-750'
                            : dist.risk === 'MEDIUM'
                            ? 'bg-amber-100 text-amber-750'
                            : 'bg-green-100 text-green-750'
                        }`}
                      >
                        {dist.risk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-blue-50 border border-blue-100 p-3.5 rounded-2xl text-[9px] text-blue-750 font-bold leading-normal">
            Force metrics and allocations are reconciled on a weekly base frequency across district nodal desk terminals.
          </div>
        </div>
      </div>
    </div>
  )
}
