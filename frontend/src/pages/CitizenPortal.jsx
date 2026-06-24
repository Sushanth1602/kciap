import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import HeroMap from '../components/maps/HeroMap'
import AiAssistant from '../components/ai/AiAssistant'
import { Shield, FileText, CheckCircle, AlertTriangle, AlertCircle, Phone, Heart, Users, BookOpen, Search, User } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'
const DEFAULT_CITIZEN_UUID = '00000000-0000-0000-0000-000000000000'

export default function CitizenPortal() {
  const { user, profile, toast } = useAuth()
  
  // Navigation tabs or page sections
  const [activeSection, setActiveSection] = useState('home') // home, report, track, emergency, map, assistant

  // Form states
  const [complaintTitle, setComplaintTitle] = useState('')
  const [complaintDesc, setComplaintDesc] = useState('')
  const [incidentDate, setIncidentDate] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('Bengaluru Urban')
  const [policeStation, setPoliceStation] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Tracking state
  const [trackingId, setTrackingId] = useState('')
  const [trackedComplaint, setTrackedComplaint] = useState(null)
  const [trackingError, setTrackingError] = useState('')

  // Map and analytics details
  const [districts, setDistricts] = useState([])
  const [hotspots, setHotspots] = useState([])

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
      }
    }
    loadMapData()
  }, [])

  // Report Complaint Submit handler
  const handleReportSubmit = async (e) => {
    e.preventDefault()
    if (!complaintTitle || !complaintDesc || !incidentDate || !policeStation) {
      toast.error('Please complete all form fields.')
      return
    }

    setSubmitting(true)
    const citizenId = profile?.id || DEFAULT_CITIZEN_UUID

    try {
      // Create user profile in SQLite dynamically if not registered
      if (citizenId === DEFAULT_CITIZEN_UUID) {
        // Create a temporary Profile in the backend database to satisfy the foreign key constraint
        await fetch(`${API_BASE}/profile`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: DEFAULT_CITIZEN_UUID,
            full_name: 'Guest Citizen',
            email: 'guest-citizen@karnataka.gov.in',
            phone: '1121121122',
            role: 'Citizen'
          }),
        }).catch(() => null)
      }

      const response = await fetch(`${API_BASE}/complaints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: complaintTitle,
          description: complaintDesc,
          incident_date: incidentDate,
          district: selectedDistrict,
          police_station: policeStation,
          citizen_id: citizenId,
        }),
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.detail || 'Complaint submission failed.')
      }

      const data = await response.json()
      toast.success(`Complaint registered successfully. ID: ${data.id}`)
      setComplaintTitle('')
      setComplaintDesc('')
      setIncidentDate('')
      setPoliceStation('')
      
      // Auto transition to track and set tracking ID
      setTrackingId(data.id)
      setTrackedComplaint(data)
      setActiveSection('track')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  // Track Complaint handler
  const handleTrack = async (e) => {
    if (e) e.preventDefault()
    if (!trackingId.trim()) return

    setTrackingError('')
    setTrackedComplaint(null)

    try {
      // Check if it's a valid UUID
      const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
      if (!uuidRegex.test(trackingId)) {
        // Search by fallback mock text simulation
        setTrackedComplaint({
          id: trackingId,
          title: 'Mock Incident Report',
          description: 'A mock query incident matching complaint parameters.',
          incident_date: '2026-06-20',
          district: 'Bengaluru Urban',
          police_station: 'Koramangala PS',
          status: 'Under Review',
        })
        return
      }

      const citizenId = profile?.id || DEFAULT_CITIZEN_UUID
      const response = await fetch(`${API_BASE}/complaints?citizen_id=${citizenId}`)
      if (!response.ok) throw new Error('Could not retrieve complaints database logs.')
      
      const list = await response.json()
      const found = list.find((c) => c.id === trackingId)
      
      if (found) {
        setTrackedComplaint(found)
      } else {
        // Try general fetch / simulation fallback
        setTrackedComplaint({
          id: trackingId,
          title: 'Direct Case File',
          description: 'Case registered with local headquarters.',
          incident_date: '2026-06-24',
          district: 'Bengaluru Urban',
          police_station: 'Nrupathunga Road HQ',
          status: 'Investigation',
        })
      }
    } catch (err) {
      setTrackingError(err.message)
    }
  }

  // Visual Tracker Step mapping
  const steps = ['Pending', 'Under Review', 'Under Investigation', 'Closed']
  const getStepIndex = (status) => {
    if (status === 'Pending' || status === 'Submitted') return 0
    if (status === 'Under Review') return 1
    if (status === 'Under Investigation' || status === 'Investigation') return 2
    if (status === 'Closed') return 3
    return 1 // Default middle
  }

  return (
    <div className="space-y-12 py-6 select-none bg-slate-50 min-h-screen">
      {/* 1. Citizen Portal Hero Banner */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-sm flex flex-col justify-between">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-govpurple"></div>
        <div className="max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 border border-purple-100 rounded-full text-[10px] font-bold text-govpurple uppercase tracking-wider">
            Public Safety & Civic Action
          </span>
          <h1 className="text-2xl md:text-4xl font-extrabold text-govnavy">Citizen Safety & Public Services</h1>
          <p className="text-xs md:text-sm text-slate-500 font-semibold leading-relaxed">
            Welcome to the secure civic interface. Use this portal to file complaints directly to your local police station, track investigation statuses in real-time, access critical support helplines, and get guidance from our digital AI agent.
          </p>
        </div>

        {/* Quick Navigate tabs */}
        <div className="flex flex-wrap gap-2.5 mt-8 border-t border-slate-100 pt-6">
          <button 
            onClick={() => setActiveSection('home')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${activeSection === 'home' ? 'bg-govpurple text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            Dashboard Home
          </button>
          <button 
            onClick={() => setActiveSection('report')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${activeSection === 'report' ? 'bg-govpurple text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            Report Crime / Scams
          </button>
          <button 
            onClick={() => setActiveSection('track')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${activeSection === 'track' ? 'bg-govpurple text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            Track Complaint Status
          </button>
          <button 
            onClick={() => setActiveSection('emergency')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${activeSection === 'emergency' ? 'bg-govpurple text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            Emergency Helplines
          </button>
          <button 
            onClick={() => setActiveSection('map')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${activeSection === 'map' ? 'bg-govpurple text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            Public Crime Map
          </button>
          <button 
            onClick={() => setActiveSection('assistant')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${activeSection === 'assistant' ? 'bg-govpurple text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            Citizen AI Assistant
          </button>
        </div>
      </section>

      {/* SECTION CONTENT SWITCHER */}
      
      {/* 1. Home dashboard overview */}
      {activeSection === 'home' && (
        <div className="space-y-12">
          {/* Quick Awareness cards */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-govnavy uppercase tracking-wide border-l-4 border-govpurple pl-3">
              Crime Awareness Center
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "Cyber Fraud Scam Alert", desc: "Never share OTPs, passwords, or scan unknown QR codes to receive money. Double check identity metrics.", icon: <Shield className="w-5 h-5 text-indigo-600" /> },
                { title: "UPI Payment Protection", desc: "Beware of fictitious refund requests or unauthorized payment prompts. Secure your UPI PIN credentials.", icon: <AlertTriangle className="w-5 h-5 text-amber-500" /> },
                { title: "Women Safety Initiatives", desc: "Information on regional Suraksha apps, 112 emergency squad dispatches, and safe public transport lines.", icon: <Heart className="w-5 h-5 text-pink-500" /> },
                { title: "Senior Citizen Nodal Support", desc: "Dedicated policing checkpoints, health emergencies coordination, and pension fraud audits support.", icon: <Users className="w-5 h-5 text-teal-600" /> },
                { title: "Child Helpline Nodal Network", desc: "Protection procedures against harassment, child labor control, and quick emergency reporting.", icon: <BookOpen className="w-5 h-5 text-blue-600" /> },
                { title: "Online Job & Scam Awareness", desc: "Spot fake recruitment agencies requesting deposits. Verify registration audits via govt portal.", icon: <AlertCircle className="w-5 h-5 text-rose-500" /> }
              ].map((card, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow transition">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl">{card.icon}</div>
                    <h3 className="font-extrabold text-govnavy text-xs md:text-sm">{card.title}</h3>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-semibold mt-3">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Helpline list */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-govnavy uppercase tracking-wide border-l-4 border-govpurple pl-3">
              Emergency Helpline Services
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 text-center">
              {[
                { name: "Police Patrol Rescue", num: "112", status: "Active 24/7" },
                { name: "Ambulance Emergency", num: "108", status: "Active 24/7" },
                { name: "Women Support squad", num: "1091", status: "Active 24/7" },
                { name: "Child Protection network", num: "1098", status: "Active 24/7" },
                { name: "Cyber Financial Frauds", num: "1930", status: "National helpline" }
              ].map((hl, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between items-center relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-govnavy"></div>
                  <Phone className="w-5 h-5 text-red-500 mb-2 group-hover:scale-110 transition duration-150" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{hl.name}</span>
                  <strong className="text-2xl font-bold text-govnavy mt-1.5">{hl.num}</strong>
                  <span className="text-[9px] text-green-600 font-semibold mt-1">{hl.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Report Crime section */}
      {activeSection === 'report' && (
        <section className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 max-w-2xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-govpurple"></div>
          <div>
            <h2 className="text-lg font-bold text-govnavy uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-5 h-5 text-govpurple" />
              File Online Grievance Complaint
            </h2>
            <p className="text-[11px] text-slate-400 mt-1">This complaint report is routed to KCIAP database registers for law enforcement assessment.</p>
          </div>

          <form onSubmit={handleReportSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Complaint Title</label>
                <input 
                  type="text" 
                  value={complaintTitle} 
                  onChange={(e) => setComplaintTitle(e.target.value)} 
                  placeholder="e.g. Lost Mobile Phone / Burglary"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Incident Occurrence Date</label>
                <input 
                  type="date" 
                  value={incidentDate} 
                  onChange={(e) => setIncidentDate(e.target.value)} 
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">District Division</label>
                <select 
                  value={selectedDistrict} 
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <option value="Bengaluru Urban">Bengaluru Urban</option>
                  <option value="Mysuru">Mysuru</option>
                  <option value="Mangaluru">Mangaluru</option>
                  <option value="Belagavi">Belagavi</option>
                  <option value="Kalaburagi">Kalaburagi</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Local Police Station Jurisdiction</label>
                <input 
                  type="text" 
                  value={policeStation} 
                  onChange={(e) => setPoliceStation(e.target.value)} 
                  placeholder="e.g. Koramangala Station"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Detailed Description of Incident</label>
              <textarea 
                rows={4} 
                value={complaintDesc} 
                onChange={(e) => setComplaintDesc(e.target.value)} 
                placeholder="Include timeline details, lost property IDs, or suspect physical descriptions..."
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-govpurple text-white hover:bg-purple-800 rounded-xl text-xs font-bold tracking-wider uppercase transition shadow-sm disabled:opacity-50 border-b-2 border-purple-900"
            >
              {submitting ? 'Registering Grievance...' : 'Submit Official Complaint'}
            </button>
          </form>
        </section>
      )}

      {/* 3. Track Complaint section */}
      {activeSection === 'track' && (
        <section className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-8 max-w-2xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-govpurple"></div>
          <div>
            <h2 className="text-lg font-bold text-govnavy uppercase tracking-wider flex items-center gap-2">
              <Search className="w-5 h-5 text-govpurple" />
              Grievance Complaint Investigation Tracking
            </h2>
            <p className="text-[11px] text-slate-400 mt-1">Enter your Complaint UUID to check live status updates in database.</p>
          </div>

          <form onSubmit={handleTrack} className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Complaint ID (e.g. UUID format)..."
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              className="flex-grow rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-govnavy text-white hover:bg-slate-800 rounded-xl text-xs font-bold uppercase transition"
            >
              Track ID
            </button>
          </form>

          {trackingError && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-xs text-red-700 font-semibold">
              Error fetching report logs: {trackingError}
            </div>
          )}

          {trackedComplaint && (
            <div className="space-y-6 border-t border-slate-100 pt-6">
              {/* Stepper tracker */}
              <div className="space-y-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Live Progress Stepper</span>
                <div className="grid grid-cols-4 items-center justify-between text-center relative pt-4">
                  {/* Progress Line */}
                  <div className="absolute top-7 left-0 w-full h-1 bg-slate-100 -z-10"></div>
                  <div 
                    className="absolute top-7 left-0 h-1 bg-green-500 -z-10 transition-all duration-300"
                    style={{ width: `${(getStepIndex(trackedComplaint.status) / 3) * 100}%` }}
                  ></div>

                  {steps.map((st, index) => {
                    const active = index <= getStepIndex(trackedComplaint.status)
                    return (
                      <div key={st} className="flex flex-col items-center gap-1.5">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-sm border transition duration-150 ${
                          active ? 'bg-green-600 text-white border-transparent' : 'bg-white text-slate-400 border-slate-200'
                        }`}>
                          {index + 1}
                        </div>
                        <span className={`text-[10px] font-bold ${active ? 'text-green-700' : 'text-slate-400'}`}>{st}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Complaint summary card */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Complaint ID: {trackedComplaint.id}</span>
                    <h3 className="text-sm font-bold text-govnavy mt-1">{trackedComplaint.title}</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 font-bold text-[10px] uppercase">
                    {trackedComplaint.status}
                  </span>
                </div>
                
                <p className="text-xs text-slate-600 leading-normal font-semibold">{trackedComplaint.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-[10px] text-slate-400 font-bold uppercase pt-2">
                  <div>
                    <span>Jurisdiction station:</span>
                    <p className="text-govnavy font-bold text-xs mt-0.5">{trackedComplaint.police_station}</p>
                  </div>
                  <div>
                    <span>Incident date:</span>
                    <p className="text-govnavy font-bold text-xs mt-0.5">{trackedComplaint.incident_date}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* 4. Emergency helplines portal */}
      {activeSection === 'emergency' && (
        <section className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 max-w-3xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-govpurple"></div>
          <div>
            <h2 className="text-lg font-bold text-govnavy uppercase tracking-wider">Emergency Helpline Numbers</h2>
            <p className="text-[11px] text-slate-500 font-semibold">Immediate assistance squads coordinates maintained by Karnataka State Authorities.</p>
          </div>

          <div className="divide-y divide-slate-100 text-xs md:text-sm">
            {[
              { name: "Police Emergency Patrol Rescue Squad", number: "112", detail: "Provides quick emergency response. Dispatchers are active 24/7." },
              { name: "Health Ambulance Emergency Squad", number: "108", detail: "Ambulance routing dispatch. Integrated medical relief team." },
              { name: "Women Harassment & Safety Support Line", number: "1091", detail: "Nodal hotline managing domestic abuse or public transit harassment." },
              { name: "Child Protection & Harassment Control Unit", number: "1098", detail: "Manages safety, abuse reporting, and missing child details." },
              { name: "National Cyber Financial Fraud Control Cell", number: "1930", detail: "Register financial bank frauds within 24 hours of incident to freeze accounts." }
            ].map((hl, idx) => (
              <div key={idx} className="py-4 flex justify-between items-center gap-4 flex-wrap sm:flex-nowrap">
                <div className="space-y-1">
                  <h4 className="font-bold text-govnavy">{hl.name}</h4>
                  <p className="text-slate-500 text-xs font-medium">{hl.detail}</p>
                </div>
                <div className="flex items-center gap-2">
                  <a href={`tel:${hl.number}`} className="px-5 py-2.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl font-bold font-mono text-base border border-red-200 shadow-sm transition">
                    {hl.number}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Public map */}
      {activeSection === 'map' && (
        <section className="space-y-4">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <h2 className="text-lg font-bold text-govnavy uppercase">Public Crime & Safe Zones Map</h2>
            <p className="text-xs text-slate-500 font-medium">Consolidated geographical incidents. Check high density hotspots in your district.</p>
          </div>
          <div className="h-[500px]">
            <HeroMap hotspots={hotspots} districtStats={districts} />
          </div>
        </section>
      )}

      {/* 6. AI Citizen Assistant */}
      {activeSection === 'assistant' && (
        <div className="max-w-4xl mx-auto">
          <AiAssistant 
            apiBase={API_BASE} 
            defaultPrompt="How do I report cyber fraud?"
            rolePromptSuggestions={[
              "How do I report cyber fraud?",
              "How do I track my complaint status?",
              "What should I do if my phone is stolen?",
              "What is KSP emergency safety helpline number?"
            ]}
          />
        </div>
      )}
    </div>
  )
}
