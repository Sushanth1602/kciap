import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Shield, FileText, Search, ShieldAlert, Cpu, AlertTriangle, Compass, CheckCircle, Clock, Camera } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export default function OfficerDashboard() {
  const { profile } = useAuth()
  const navigate = useNavigate()

  const [crimes, setCrimes] = useState([])
  const [summary, setSummary] = useState({ total_crimes: 140, active_cases: 85, closed_cases: 55, high_severity_cases: 24 })
  
  useEffect(() => {
    async function loadStats() {
      try {
        const [sum, list] = await Promise.all([
          fetch(`${API_BASE}/analytics/summary`).then((r) => r.json()).catch(() => null),
          fetch(`${API_BASE}/crimes`).then((r) => r.json()).catch(() => [])
        ])
        if (sum) setSummary(sum)
        if (Array.isArray(list)) setCrimes(list)
      } catch (err) {
        console.error(err)
      }
    }
    loadStats()
  }, [])

  const caseKpis = useMemo(() => {
    const activeCount = crimes.filter(c => c.status !== 'Closed').length
    const closedCount = crimes.filter(c => c.status === 'Closed').length
    const criticalCount = crimes.filter(c => c.severity >= 4).length
    return {
      assigned: activeCount > 0 ? Math.ceil(activeCount / 4) : 8,
      active: activeCount || summary.active_cases || 85,
      openFirs: crimes.length || summary.total_crimes || 140,
      highPriority: criticalCount || summary.high_severity_cases || 24
    }
  }, [crimes, summary])

  return (
    <div className="space-y-8 select-none text-slate-350">
      {/* Greetings Banner */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-sm flex flex-col justify-between md:flex-row items-center gap-4">
        <div className="absolute top-0 left-0 w-full h-1 bg-govgold"></div>
        <div className="space-y-1.5 text-left">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-yellow-950/80 border border-govgold/20 text-[9px] font-bold text-govgold rounded uppercase tracking-wider">
            Duty Inspector Command
          </span>
          <h2 className="text-xl font-bold text-white uppercase tracking-wide">
            Good Morning Inspector, {profile?.full_name?.split(' ')[0] || 'Officer'}
          </h2>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed">
            Operations control console activated. State databases show stable control indexes for the current beat logs.
          </p>
        </div>
      </section>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 font-semibold text-xs">
        <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-full h-1 bg-govgold"></div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Assigned Cases</span>
            <p className="text-2xl font-bold text-white mt-2 font-mono">{caseKpis.assigned}</p>
          </div>
          <span className="text-[9px] text-govgold font-bold uppercase mt-3">Investigating YTD</span>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-full h-1 bg-govgold"></div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Open FIRs</span>
            <p className="text-2xl font-bold text-white mt-2 font-mono">{caseKpis.openFirs}</p>
          </div>
          <span className="text-[9px] text-govgold font-bold uppercase mt-3 font-semibold">Consolidated logs</span>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-full h-1 bg-govgold"></div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Investigations</span>
            <p className="text-2xl font-bold text-white mt-2 font-mono">{caseKpis.active}</p>
          </div>
          <span className="text-[9px] text-govgold font-bold uppercase mt-3 font-semibold">Under ongoing beat</span>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-650"></div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-semibold">Priority Alerts</span>
            <p className="text-2xl font-bold text-red-400 mt-2 font-mono">{caseKpis.highPriority}</p>
          </div>
          <span className="text-[9px] text-red-500 font-bold uppercase mt-3">Severity level 4 & 5</span>
        </div>
      </div>

      {/* Main Grid: Quick actions on left, Incident Feed on right */}
      <div className="grid gap-6 md:grid-cols-12 items-stretch">
        
        {/* Left: Quick actions */}
        <div className="md:col-span-8 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-850 pb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-govgold" />
              Quick Command Actions
            </h3>
            
            <div className="grid gap-4 sm:grid-cols-2 mt-4 text-xs font-bold uppercase text-slate-350">
              <button 
                onClick={() => navigate('/officer/fir')}
                className="p-4 bg-slate-950 border border-slate-800 hover:border-govgold rounded-xl flex items-center gap-3 transition text-left"
              >
                <div className="p-2 bg-govgold/10 text-govgold rounded-lg border border-govgold/20"><FileText className="w-5 h-5" /></div>
                <div>
                  <p className="text-white">Register FIR</p>
                  <span className="text-[9px] text-slate-500 leading-normal font-semibold lowercase">File crime parameters</span>
                </div>
              </button>

              <button 
                onClick={() => navigate('/officer/search')}
                className="p-4 bg-slate-950 border border-slate-800 hover:border-govgold rounded-xl flex items-center gap-3 transition text-left"
              >
                <div className="p-2 bg-govgold/10 text-govgold rounded-lg border border-govgold/20"><Search className="w-5 h-5" /></div>
                <div>
                  <p className="text-white">Search Criminal</p>
                  <span className="text-[9px] text-slate-500 leading-normal font-semibold lowercase">Lookup suspect details</span>
                </div>
              </button>

              <button 
                onClick={() => navigate('/officer/evidence')}
                className="p-4 bg-slate-950 border border-slate-800 hover:border-govgold rounded-xl flex items-center gap-3 transition text-left"
              >
                <div className="p-2 bg-govgold/10 text-govgold rounded-lg border border-govgold/20"><Camera className="w-5 h-5" /></div>
                <div>
                  <p className="text-white">Upload Evidence</p>
                  <span className="text-[9px] text-slate-500 leading-normal font-semibold lowercase">Attach witness / media file</span>
                </div>
              </button>

              <button 
                onClick={() => navigate('/officer/reports')}
                className="p-4 bg-slate-950 border border-slate-800 hover:border-govgold rounded-xl flex items-center gap-3 transition text-left"
              >
                <div className="p-2 bg-govgold/10 text-govgold rounded-lg border border-govgold/20"><Cpu className="w-5 h-5" /></div>
                <div>
                  <p className="text-white">Generate Report</p>
                  <span className="text-[9px] text-slate-500 leading-normal font-semibold lowercase">Compile investigation brief</span>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-2xl text-[10px] text-slate-500 font-bold uppercase leading-normal mt-6">
            Verification Warning: Database transactions logged securely with inspector badge parameters.
          </div>
        </div>

        {/* Right Panel: Live incident feed */}
        <div className="md:col-span-4 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-850 pb-3">
              <Clock className="w-4 h-4 text-govgold" />
              Live Incident Feed
            </h3>

            <div className="space-y-3.5 max-h-80 overflow-y-auto pr-1">
              {[
                { time: "01:15", type: "Cyber Fraud", loc: "Bengaluru" },
                { time: "01:12", type: "Vehicle Theft", loc: "Mysuru" },
                { time: "01:08", type: "Assault", loc: "Hubballi" },
                { time: "00:45", type: "Burglary", loc: "Mangaluru" },
                { time: "00:30", type: "Drug Offence", loc: "Belagavi" }
              ].map((feed, index) => (
                <div key={index} className="flex gap-3 text-xs leading-normal">
                  <span className="font-mono text-govgold font-bold">{feed.time}</span>
                  <div className="text-left">
                    <p className="font-bold text-slate-200">{feed.type}</p>
                    <span className="text-[9px] text-slate-500 font-bold uppercase">Division: {feed.loc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
