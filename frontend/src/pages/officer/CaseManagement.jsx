import React, { useState, useEffect } from 'react'
import { Briefcase, Clock, CheckCircle, ShieldAlert } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export default function CaseManagement() {
  const [crimes, setCrimes] = useState([])
  const [activeFilter, setActiveFilter] = useState('all') // all, open, investigating, closed
  const [selectedCase, setSelectedCase] = useState(null)

  useEffect(() => {
    fetch(`${API_BASE}/crimes`)
      .then((r) => r.json())
      .then((list) => {
        if (Array.isArray(list)) {
          setCrimes(list)
          if (list.length > 0) setSelectedCase(list[0])
        }
      })
      .catch(console.error)
  }, [])

  const filteredCases = crimes.filter((c) => {
    if (activeFilter === 'open') return c.status === 'Pending' || c.status === 'Submitted'
    if (activeFilter === 'investigating') return c.status === 'Investigation' || c.status === 'Under Investigation'
    if (activeFilter === 'closed') return c.status === 'Closed'
    return true
  })

  return (
    <div className="space-y-8 select-none text-slate-350">
      {/* Banner */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 w-full h-1 bg-govgold"></div>
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-govgold/10 rounded-xl text-govgold border border-govgold/20">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wide">Case File Directory</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Filter active case logs and review crime timelines</p>
          </div>
        </div>
      </section>

      {/* Grid */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left List */}
        <div className="lg:col-span-7 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-2 border-b border-slate-850 pb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Active Logs</h3>
            
            {/* Filter buttons */}
            <div className="flex gap-1.5 text-[9px] font-bold uppercase">
              {['all', 'open', 'investigating', 'closed'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-2.5 py-1 rounded transition border ${
                    activeFilter === filter 
                      ? 'bg-govgold border-transparent text-govnavy' 
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-850 border border-slate-850 rounded-2xl">
            {filteredCases.map((c) => (
              <div 
                key={c.crime_id} 
                onClick={() => setSelectedCase(c)}
                className={`p-4 flex justify-between items-center gap-4 transition cursor-pointer ${
                  selectedCase?.crime_id === c.crime_id ? 'bg-slate-800/40' : 'hover:bg-slate-950/20'
                }`}
              >
                <div className="text-left space-y-1">
                  <span className="text-[9px] text-govgold font-mono font-bold">{c.crime_id}</span>
                  <h4 className="text-xs font-bold text-white leading-normal">{c.crime_type}</h4>
                  <p className="text-[10px] text-slate-500 font-semibold">{c.police_station}, {c.district}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[8px] font-bold tracking-wider uppercase inline-block border ${
                  c.status === 'Closed' ? 'bg-green-950 text-green-400 border-green-500/10' : 'bg-orange-950 text-orange-400 border-orange-500/10'
                }`}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Details / Timeline */}
        <div className="lg:col-span-5 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-850 pb-3">
            Investigation Progress & Details
          </h3>

          {selectedCase ? (
            <div className="space-y-6 text-xs text-left">
              <div className="space-y-2">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono">Case ID: {selectedCase.crime_id}</span>
                <h4 className="text-sm font-bold text-white">{selectedCase.crime_type}</h4>
                <p className="text-slate-400 font-semibold leading-relaxed"><strong>MO:</strong> {selectedCase.modus_operandi}</p>
              </div>

              {/* Steps timeline */}
              <div className="space-y-3.5 border-t border-slate-850 pt-4">
                <span className="text-[10px] text-slate-550 font-bold uppercase tracking-wider">Investigation Milestones</span>
                
                <div className="relative pl-5 border-l border-slate-800 space-y-4">
                  <div className="relative">
                    <div className="absolute -left-[25px] top-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-slate-900"></div>
                    <strong className="text-slate-200">FIR Registered</strong>
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Committed to security database logs: {selectedCase.crime_date}</p>
                  </div>
                  
                  <div className="relative">
                    <div className={`absolute -left-[25px] top-0.5 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${
                      selectedCase.status !== 'Pending' ? 'bg-green-500' : 'bg-slate-700'
                    }`}></div>
                    <strong className={selectedCase.status !== 'Pending' ? 'text-slate-200' : 'text-slate-500'}>Assigned to local Station Officer</strong>
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Dispatched to {selectedCase.police_station}</p>
                  </div>

                  <div className="relative">
                    <div className={`absolute -left-[25px] top-0.5 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${
                      selectedCase.status === 'Closed' ? 'bg-green-500' : 'bg-slate-700'
                    }`}></div>
                    <strong className={selectedCase.status === 'Closed' ? 'text-slate-200' : 'text-slate-500'}>Case Closed</strong>
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Clearance verification approved</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 font-medium py-8 text-center">Select a case file to audit investigation progress.</p>
          )}
        </div>
      </div>
    </div>
  )
}
