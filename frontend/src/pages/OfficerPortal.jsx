import React, { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../hooks/useAuth'
import CrimeMap from '../components/maps/CrimeMap'
import NetworkAnalysis from '../components/analytics/NetworkAnalysis'
import HotspotTable from '../components/analytics/HotspotTable'
import AiAssistant from '../components/ai/AiAssistant'
import { Shield, FileText, Search, ShieldAlert, Cpu, Layers, AlertCircle, Compass, CheckCircle } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'
const DEFAULT_OFFICER_UUID = '00000000-0000-0000-0000-000000000000'

export default function OfficerPortal() {
  const { user, profile, toast } = useAuth()
  
  // Tab routing
  const [activeTab, setActiveTab] = useState('dashboard') // dashboard, register, search, map, network, hotspots, assistant

  // Case lists & metrics
  const [crimes, setCrimes] = useState([])
  const [hotspots, setHotspots] = useState([])
  const [summary, setSummary] = useState({ total_crimes: 140, active_cases: 85, closed_cases: 55, high_severity_cases: 24 })
  const [loading, setLoading] = useState(true)

  // FIR Form states
  const [crimeType, setCrimeType] = useState('Theft')
  const [severityLevel, setSeverityLevel] = useState(3)
  const [modusOperandi, setModusOperandi] = useState('')
  const [weaponUsed, setWeaponUsed] = useState('None')
  const [latitude, setLatitude] = useState('13.0120')
  const [longitude, setLongitude] = useState('77.5980')
  const [submittingFir, setSubmittingFir] = useState(false)

  // Criminal Search states
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState('name') // name, suspect_id, crime_type
  const [searchResults, setSearchResults] = useState([])

  // Load database metrics YTD
  useEffect(() => {
    async function loadData() {
      try {
        const [crimesRes, summaryRes, hotspotsRes] = await Promise.all([
          fetch(`${API_BASE}/crimes`).then((r) => r.json()).catch(() => []),
          fetch(`${API_BASE}/analytics/summary`).then((r) => r.json()).catch(() => null),
          fetch(`${API_BASE}/analytics/hotspots`).then((r) => r.json()).catch(() => ({ hotspots: [] }))
        ])

        if (Array.isArray(crimesRes)) setCrimes(crimesRes)
        if (summaryRes) setSummary(summaryRes)
        if (hotspotsRes && Array.isArray(hotspotsRes.hotspots)) setHotspots(hotspotsRes.hotspots)
      } catch (err) {
        console.error("Error loading officer data:", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // FIR Submission handler
  const handleRegisterFir = async (e) => {
    e.preventDefault()
    if (!crimeType || !latitude || !longitude || !modusOperandi) {
      toast.error("Please complete all FIR parameters.")
      return
    }

    setSubmittingFir(true)
    const officerId = profile?.id || DEFAULT_OFFICER_UUID

    try {
      // Ensure officer is created defensively in SQLite
      if (officerId === DEFAULT_OFFICER_UUID) {
        await fetch(`${API_BASE}/profile`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: DEFAULT_OFFICER_UUID,
            full_name: 'Duty Police Officer',
            email: 'officer@karnataka.gov.in',
            phone: '9999999999',
            role: 'Police Officer'
          }),
        }).catch(() => null)
      }

      const response = await fetch(`${API_BASE}/crime-reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crime_type: crimeType,
          severity_level: parseInt(severityLevel),
          modus_operandi: modusOperandi,
          weapon_used: weaponUsed,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          assigned_officer_id: officerId
        }),
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.detail || 'FIR database writing failed.')
      }

      const data = await response.json()
      toast.success(`FIR Case Report registered. Case ID: ${data.id}`)
      
      // Reset form
      setModusOperandi('')
      setWeaponUsed('None')
      setLatitude('13.0120')
      setLongitude('77.5980')
      
      // Reload lists
      const crimesList = await fetch(`${API_BASE}/crimes`).then((r) => r.json()).catch(() => [])
      if (Array.isArray(crimesList)) setCrimes(crimesList)

      setActiveTab('dashboard')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSubmittingFir(false)
    }
  }

  // Criminal lookup simulation based on generated crime datasets
  const handleCriminalSearch = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    const query = searchQuery.toLowerCase()
    const matches = crimes.filter((c) => {
      if (searchType === 'suspect_id') return c.suspect_id.toLowerCase().includes(query)
      if (searchType === 'crime_type') return c.crime_type.toLowerCase().includes(query)
      // Name simulation
      return c.suspect_id.toLowerCase().includes(query) || c.police_station.toLowerCase().includes(query)
    })

    setSearchResults(matches)
  }

  // Pre-compiled KPIs
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
    <div className="space-y-12 py-6 select-none bg-[#0B132B] text-slate-100 min-h-screen px-4 md:px-8 rounded-3xl border border-slate-900 shadow-xl">
      {/* Title Bar */}
      <header className="flex justify-between items-center flex-wrap gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-500/10 text-govgold border border-govgold/30 rounded-2xl flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-wider text-white">Secure Officer Command Portal</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Karnataka State Police Command Workspace</p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="px-4 py-2 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-govgold/20 border border-govgold/30 flex items-center justify-center text-govgold text-xs font-bold uppercase">
            {profile?.full_name?.charAt(0) || 'P'}
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-slate-200">{profile?.full_name || 'Officer'}</p>
            <span className="text-[9px] text-govgold uppercase font-bold tracking-wider">Badge: KSP-{profile?.phone?.slice(-4) || '9012'}</span>
          </div>
        </div>
      </header>

      {/* Navigation Panels */}
      <nav className="flex flex-wrap gap-2 border-b border-slate-850 pb-4">
        {[
          { id: 'dashboard', name: 'Duty Dashboard', icon: <Layers className="w-4 h-4" /> },
          { id: 'register', name: 'Register FIR Case', icon: <FileText className="w-4 h-4" /> },
          { id: 'search', name: 'Criminal Search', icon: <Search className="w-4 h-4" /> },
          { id: 'map', name: 'Tactical Map', icon: <Compass className="w-4 h-4" /> },
          { id: 'network', name: 'Link Analysis', icon: <ShieldAlert className="w-4 h-4" /> },
          { id: 'hotspots', name: 'Threat Hotspots', icon: <Cpu className="w-4 h-4" /> },
          { id: 'assistant', name: 'Investigation AI', icon: <Shield className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 border ${
              activeTab === tab.id 
                ? 'bg-govgold text-govnavy border-transparent shadow' 
                : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            {tab.icon}
            {tab.name}
          </button>
        ))}
      </nav>

      {/* SWITCH ACTIVE PANEL */}

      {/* 1. Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-12">
          {/* KPI Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 left-0 w-full h-1 bg-govgold"></div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Assigned Cases</span>
                <p className="text-2xl font-bold text-white mt-2 font-mono">{caseKpis.assigned}</p>
              </div>
              <span className="text-[9px] text-govgold font-semibold mt-4">Active duty cases YTD</span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 left-0 w-full h-1 bg-govgold"></div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Investigations</span>
                <p className="text-2xl font-bold text-white mt-2 font-mono">{caseKpis.active}</p>
              </div>
              <span className="text-[9px] text-govgold font-semibold mt-4">Ongoing analysis audits</span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 left-0 w-full h-1 bg-govgold"></div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Open FIR Registers</span>
                <p className="text-2xl font-bold text-white mt-2 font-mono">{caseKpis.openFirs}</p>
              </div>
              <span className="text-[9px] text-govgold font-semibold mt-4">Consolidated case entries</span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">High Priority Cases</span>
                <p className="text-2xl font-bold text-red-400 mt-2 font-mono">{caseKpis.highPriority}</p>
              </div>
              <span className="text-[9px] text-red-500 font-semibold mt-4">Severity level 4 & 5 files</span>
            </div>
          </div>

          {/* Case files listing */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-l-4 border-govgold pl-3">
              <Layers className="w-4 h-4 text-govgold" />
              Active Investigations Case Log
            </h2>
            <div className="border border-slate-800 rounded-2xl bg-slate-900/40 overflow-hidden text-xs md:text-sm">
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full border-collapse text-left">
                  <thead className="bg-slate-900 border-b border-slate-800 text-[10px] font-bold uppercase text-slate-450 tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Case ID</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">District</th>
                      <th className="px-4 py-3">Station</th>
                      <th className="px-4 py-3 text-center">Severity</th>
                      <th className="px-4 py-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {crimes.slice(0, 15).map((c) => (
                      <tr key={c.crime_id} className="hover:bg-slate-800/45 transition">
                        <td className="px-4 py-3 font-mono font-bold text-govgold">{c.crime_id}</td>
                        <td className="px-4 py-3 font-semibold text-slate-200">{c.crime_type}</td>
                        <td className="px-4 py-3 text-slate-400 font-medium">{c.district}</td>
                        <td className="px-4 py-3 text-slate-400 font-medium">{c.police_station}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            c.severity >= 4 ? 'bg-red-950/80 text-red-400 border border-red-500/20' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {c.severity}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                            c.status === 'Closed' ? 'bg-green-950 text-green-400' : 'bg-orange-950 text-orange-400'
                          }`}>
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Register FIR Tab */}
      {activeTab === 'register' && (
        <section className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 max-w-2xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-govgold"></div>
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-5 h-5 text-govgold" />
              Register New FIR Report File
            </h2>
            <p className="text-[11px] text-slate-400 mt-1">Submit official report parameters into the KSP regional crime databases.</p>
          </div>

          <form onSubmit={handleRegisterFir} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 text-xs md:text-sm">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Crime Category</label>
                <select 
                  value={crimeType} 
                  onChange={(e) => setCrimeType(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="Theft">Theft</option>
                  <option value="Burglary">Burglary</option>
                  <option value="Cyber Fraud">Cyber Fraud</option>
                  <option value="Assault">Assault</option>
                  <option value="Drug Offence">Drug Offence</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Severity Priority (1-5)</label>
                <select 
                  value={severityLevel} 
                  onChange={(e) => setSeverityLevel(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value={1}>1 - Minor Alert</option>
                  <option value={2}>2 - Elevated Concern</option>
                  <option value={3}>3 - Standard Investigation</option>
                  <option value={4}>4 - High Severity Threat</option>
                  <option value={5}>5 - Critical Nodal Emergency</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Incident Latitude Coordinates</label>
                <input 
                  type="text" 
                  value={latitude} 
                  onChange={(e) => setLatitude(e.target.value)} 
                  className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Incident Longitude Coordinates</label>
                <input 
                  type="text" 
                  value={longitude} 
                  onChange={(e) => setLongitude(e.target.value)} 
                  className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Modus Operandi (MO Method)</label>
                <input 
                  type="text" 
                  value={modusOperandi} 
                  onChange={(e) => setModusOperandi(e.target.value)} 
                  placeholder="e.g. Broken window lock access"
                  className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Weapon Utilized</label>
                <input 
                  type="text" 
                  value={weaponUsed} 
                  onChange={(e) => setWeaponUsed(e.target.value)} 
                  placeholder="e.g. Crowbar / None"
                  className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submittingFir}
              className="w-full py-3 bg-govgold text-govnavy hover:bg-yellow-500 rounded-xl text-xs font-bold tracking-wider uppercase transition shadow disabled:opacity-50 border-b-4 border-yellow-700"
            >
              {submittingFir ? 'Writing Case Logs...' : 'Commit FIR to database'}
            </button>
          </form>
        </section>
      )}

      {/* 3. Criminal Search Tab */}
      {activeTab === 'search' && (
        <section className="space-y-6 max-w-3xl mx-auto">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-4">
            <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Search className="w-5 h-5 text-govgold" />
              Criminal Suspect Lookup Database
            </h2>
            
            <form onSubmit={handleCriminalSearch} className="flex flex-col sm:flex-row gap-2">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="name">Station / Officers</option>
                <option value="suspect_id">Suspect ID Code</option>
                <option value="crime_type">Crime Type</option>
              </select>
              
              <input
                type="text"
                placeholder="Enter suspect ID or category keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              
              <button
                type="submit"
                className="px-6 py-2.5 bg-govgold text-govnavy hover:bg-yellow-500 rounded-xl text-xs font-bold uppercase transition"
              >
                Lookup
              </button>
            </form>
          </div>

          {/* Search results list */}
          {searchResults.length > 0 && (
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Identified Matches</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {searchResults.slice(0, 8).map((criminal) => (
                  <div key={criminal.crime_id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <strong className="text-xs text-govgold font-mono">{criminal.suspect_id}</strong>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 font-bold border border-slate-800 uppercase">{criminal.status}</span>
                    </div>
                    <div className="text-[11px] space-y-1">
                      <p className="text-white"><strong>Linked Case:</strong> {criminal.crime_type}</p>
                      <p className="text-slate-400"><strong>Jurisdiction:</strong> {criminal.police_station}, {criminal.district}</p>
                      <p className="text-slate-400"><strong>MO:</strong> {criminal.modus_operandi}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* 4. Tactical Map Tab */}
      {activeTab === 'map' && (
        <section className="space-y-4">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <h2 className="text-base font-bold text-white uppercase">State Tactical Crime Map Explorer</h2>
            <p className="text-xs text-slate-400">Interactive geographical visualization of incident densities and clustered hotspots.</p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-800">
            <CrimeMap crimes={crimes} hotspots={hotspots} />
          </div>
        </section>
      )}

      {/* 5. Link Analysis Tab */}
      {activeTab === 'network' && (
        <section className="max-w-4xl mx-auto">
          <NetworkAnalysis apiBase={API_BASE} />
        </section>
      )}

      {/* 6. Threat Hotspots Tab */}
      {activeTab === 'hotspots' && (
        <section className="max-w-3xl mx-auto">
          <HotspotTable hotspots={hotspots} />
        </section>
      )}

      {/* 7. AI Assistant Tab */}
      {activeTab === 'assistant' && (
        <div className="max-w-4xl mx-auto">
          <AiAssistant
            apiBase={API_BASE}
            defaultPrompt="Show repeat offenders in Bengaluru"
            rolePromptSuggestions={[
              "Show robbery cases in Bengaluru",
              "Generate investigation summary",
              "Show repeat offenders",
              "Identify weapon profiles in burglary clusters"
            ]}
          />
        </div>
      )}
    </div>
  )
}
