import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { FileText, AlertCircle, UploadCloud } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'
const DEFAULT_CITIZEN_UUID = '00000000-0000-0000-0000-000000000000'

export default function ReportCrime() {
  const { profile, toast } = useAuth()
  const navigate = useNavigate()

  const [crimeType, setCrimeType] = useState('Theft')
  const [description, setDescription] = useState('')
  const [incidentDate, setIncidentDate] = useState('')
  const [district, setDistrict] = useState('Bengaluru Urban')
  const [location, setLocation] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!description || !incidentDate || !location) {
      toast.error('Please complete all required fields.')
      return
    }

    setSubmitting(true)
    const citizenId = profile?.id || DEFAULT_CITIZEN_UUID

    try {
      // Create user profile defensively in backend SQLite if not registered
      if (citizenId === DEFAULT_CITIZEN_UUID) {
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
          title: `${crimeType}: ${location}`,
          description: description,
          incident_date: incidentDate,
          district: district,
          police_station: location, // Store specific location in police_station field
          citizen_id: citizenId,
        }),
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.detail || 'Complaint database write operation failed.')
      }

      const data = await response.json()
      toast.success(`Complaint registered successfully. ID: ${data.id}`)
      
      // Redirect to tracking page with state to auto-fill ID
      navigate('/citizen/track', { state: { trackedId: data.id } })
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 select-none">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 w-full h-1 bg-govpurple"></div>
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-govpurple/10 rounded-xl text-govpurple border border-govpurple/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-govnavy uppercase tracking-wide">Report Incident Case File</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Submit official parameters directly to jurisdictional stations</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5 text-xs md:text-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Crime Type / Category</label>
              <select 
                value={crimeType}
                onChange={(e) => setCrimeType(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="Theft">Theft / Larceny</option>
                <option value="Burglary">Burglary / Breaking-In</option>
                <option value="Cyber Fraud">Cyber Fraud / Online Scams</option>
                <option value="Assault">Assault / Physical Altercation</option>
                <option value="Missing Person">Missing Person</option>
                <option value="Other Crime">Other Crime Categories</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Occurrence Date</label>
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
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
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
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Specific Location / Station jurisdiction</label>
              <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Koramangala 5th Block, Bengaluru"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Detailed Incident Description</label>
            <textarea 
              rows={4} 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail chronological events, lost property particulars, or suspect physical traits..."
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Evidence Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Evidence Attachments (Optional)</label>
            <div className="mt-2 border-2 border-dashed border-slate-200 hover:border-govpurple rounded-xl p-6 flex flex-col items-center justify-center gap-1.5 transition cursor-pointer text-center bg-slate-50">
              <UploadCloud className="w-8 h-8 text-slate-400" />
              <span className="text-[11px] font-bold text-slate-600">Drag files here or click to browse files</span>
              <span className="text-[9px] text-slate-400 font-semibold uppercase">PDF, PNG, JPG format (max 5MB)</span>
            </div>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-start gap-2.5 text-[10px] text-red-750 font-bold leading-normal">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-650" />
            <p>Under Section 182 of the Indian Penal Code, filing false crime statements to state security authorities is an offence punishable by law.</p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-govpurple hover:bg-purple-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition border-b-2 border-purple-900 shadow-sm disabled:opacity-50"
          >
            {submitting ? 'Registering Complaint...' : 'Submit Incident Complaint'}
          </button>
        </form>
      </div>
    </div>
  )
}
