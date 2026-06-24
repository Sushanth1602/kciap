import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { FileText, ShieldAlert, CheckCircle, Search, HelpCircle } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'
const DEFAULT_OFFICER_UUID = '00000000-0000-0000-0000-000000000000'

export default function FirManagement() {
  const { profile, toast } = useAuth()

  // Form states
  const [crimeType, setCrimeType] = useState('Theft')
  const [severityLevel, setSeverityLevel] = useState(3)
  const [modusOperandi, setModusOperandi] = useState('')
  const [weaponUsed, setWeaponUsed] = useState('None')
  const [latitude, setLatitude] = useState('13.0120')
  const [longitude, setLongitude] = useState('77.5980')
  const [submittingFir, setSubmittingFir] = useState(false)

  // Search states
  const [searchQuery, setSearchQuery] = useState('')
  const [firReports, setFirReports] = useState([])
  const [filteredReports, setFilteredReports] = useState([])

  const loadFirReports = async () => {
    try {
      // Simulate/retrieve from unified crimes list (since reports link directly in DB)
      const res = await fetch(`${API_BASE}/crimes`)
      if (res.ok) {
        const list = await res.json()
        setFirReports(list)
        setFilteredReports(list)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadFirReports()
  }, [])

  const handleCreateFir = async (e) => {
    e.preventDefault()
    if (!modusOperandi || !latitude || !longitude) {
      toast.error('Please complete all required fields.')
      return
    }

    setSubmittingFir(true)
    const officerId = profile?.id || DEFAULT_OFFICER_UUID

    try {
      // Create user profile defensively in SQLite
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
        throw new Error(errData.detail || 'FIR registration failed.')
      }

      const data = await response.json()
      toast.success(`FIR successfully committed. ID: ${data.id}`)
      
      setModusOperandi('')
      setWeaponUsed('None')
      
      // Reload reports
      loadFirReports()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSubmittingFir(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const query = searchQuery.toLowerCase()
    const matches = firReports.filter((c) => 
      c.crime_id.toLowerCase().includes(query) || 
      c.crime_type.toLowerCase().includes(query) ||
      c.suspect_id.toLowerCase().includes(query)
    )
    setFilteredReports(matches)
  }

  const handleToggleStatus = async (crimeId, currentStatus) => {
    // Simulated status toggle since backend APIs are read-only except creation
    const nextStatus = currentStatus === 'Closed' ? 'Investigation' : 'Closed'
    toast.success(`Status updated for Case ${crimeId} ➔ ${nextStatus}`)
    setFilteredReports((prev) => 
      prev.map((c) => c.crime_id === crimeId ? { ...c, status: nextStatus } : c)
    )
  }

  return (
    <div className="space-y-8 select-none text-slate-300">
      {/* Banner */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 w-full h-1 bg-govgold"></div>
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-govgold/10 rounded-xl text-govgold border border-govgold/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wide">First Information Report (FIR) Management</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Register new crime files, edit records, and query indices</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Create FIR Form */}
        <div className="lg:col-span-5 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-850 pb-3 mb-4">
            <ShieldAlert className="w-4.5 h-4.5 text-govgold" />
            File New FIR Report
          </h3>
          
          <form onSubmit={handleCreateFir} className="space-y-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Crime Classification</label>
              <select 
                value={crimeType}
                onChange={(e) => setCrimeType(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="Theft">Theft / Larceny</option>
                <option value="Burglary">Burglary / Breaking-In</option>
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
                className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value={1}>1 - Minor Alert</option>
                <option value={2}>2 - Elevated Concern</option>
                <option value={3}>3 - Standard Beat</option>
                <option value={4}>4 - High Severity Threat</option>
                <option value={5}>5 - Critical Command Dispatch</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Latitude Coordinates</label>
                <input 
                  type="text" 
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Longitude Coordinates</label>
                <input 
                  type="text" 
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Modus Operandi (MO method)</label>
              <input 
                type="text" 
                value={modusOperandi}
                onChange={(e) => setModusOperandi(e.target.value)}
                placeholder="e.g. Broke sliding door glass locks"
                className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Weapon details</label>
              <input 
                type="text" 
                value={weaponUsed}
                onChange={(e) => setWeaponUsed(e.target.value)}
                placeholder="e.g. Hammer / Crowbar / None"
                className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={submittingFir}
              className="w-full py-2.5 bg-govgold hover:bg-yellow-500 text-govnavy rounded-xl text-xs font-bold uppercase tracking-wider transition disabled:opacity-50 border-b-4 border-yellow-700"
            >
              {submittingFir ? 'Registering FIR...' : 'Commit FIR Records'}
            </button>
          </form>
        </div>

        {/* Search & Lookup FIR reports */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-sm">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-850 pb-3 mb-4">
              <Search className="w-4.5 h-4.5 text-govgold" />
              FIR Ledger Directory
            </h3>

            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Search by FIR ID, Category or Suspect Code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow rounded-xl border border-slate-850 bg-slate-950 px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button type="submit" className="px-5 py-2 bg-govgold hover:bg-yellow-500 text-govnavy font-bold text-xs rounded-xl uppercase transition">
                Search
              </button>
            </form>

            <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-850 border border-slate-850 rounded-2xl">
              {filteredReports.slice(0, 10).map((c) => (
                <div key={c.crime_id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-950/40 transition">
                  <div className="space-y-1 text-left">
                    <span className="text-[9px] text-govgold font-mono font-bold">{c.crime_id}</span>
                    <h4 className="text-xs font-bold text-white leading-normal">{c.crime_type}</h4>
                    <p className="text-[10px] text-slate-500 font-semibold">{c.police_station}, {c.district} · MO: {c.modus_operandi}</p>
                  </div>
                  
                  <div className="text-right space-y-1.5 flex-shrink-0">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold tracking-wider uppercase inline-block ${
                      c.status === 'Closed' ? 'bg-green-950 text-green-450 border border-green-500/10' : 'bg-orange-950 text-orange-450 border border-orange-500/10'
                    }`}>
                      {c.status}
                    </span>
                    <div>
                      <button 
                        onClick={() => handleToggleStatus(c.crime_id, c.status)}
                        className="px-2 py-1 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-[9px] font-bold uppercase rounded-lg text-slate-400 transition"
                      >
                        Toggle Status
                      </button>
                    </div>
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
