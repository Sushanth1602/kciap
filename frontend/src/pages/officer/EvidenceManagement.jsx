import React, { useState, useEffect } from 'react'
import { Camera, FileText, Plus, Shield, UploadCloud, CheckCircle } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export default function EvidenceManagement() {
  const { toast } = useAuth()
  
  const [crimes, setCrimes] = useState([])
  const [selectedCaseId, setSelectedCaseId] = useState('')
  const [evidenceType, setEvidenceType] = useState('CCTV Footage')
  const [description, setDescription] = useState('')
  const [witnessName, setWitnessName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [uploadedRecords, setUploadedRecords] = useState([
    { caseId: 'CR-8902', type: 'Witness Statement', desc: 'Signed statement from security guard.', user: 'Duty Inspector' },
    { caseId: 'CR-8901', type: 'CCTV Footage', desc: 'Parking lot entry camera clip.', user: 'Duty Inspector' }
  ])

  useEffect(() => {
    fetch(`${API_BASE}/crimes`)
      .then((r) => r.json())
      .then((list) => {
        if (Array.isArray(list)) {
          setCrimes(list)
          if (list.length > 0) setSelectedCaseId(list[0].crime_id)
        }
      })
      .catch(console.error)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!description) {
      toast.error('Please complete evidence description.')
      return
    }

    setSubmitting(true)
    setTimeout(() => {
      const record = {
        caseId: selectedCaseId,
        type: evidenceType,
        desc: `${description} ${witnessName ? `(Witness: ${witnessName})` : ''}`,
        user: 'Duty Inspector'
      }
      setUploadedRecords((prev) => [record, ...prev])
      toast.success('Evidence successfully uploaded and linked to case file.')
      setDescription('')
      setWitnessName('')
      setSubmitting(false)
    }, 1000)
  }

  return (
    <div className="space-y-8 select-none text-slate-350">
      {/* Banner */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 w-full h-1 bg-govgold"></div>
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-govgold/10 rounded-xl text-govgold border border-govgold/20">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wide">Evidence Management System</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Securely upload and link witness statements or media files to active cases</p>
          </div>
        </div>
      </section>

      {/* Form & Ledger Grid */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Upload Form */}
        <div className="lg:col-span-5 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-sm">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-850 pb-3 mb-4">
            Upload Evidence File
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Link to Case File ID</label>
              <select
                value={selectedCaseId}
                onChange={(e) => setSelectedCaseId(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white focus:outline-none"
              >
                {crimes.map((c) => (
                  <option key={c.crime_id} value={c.crime_id}>{c.crime_id} - {c.crime_type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Evidence Category</label>
              <select
                value={evidenceType}
                onChange={(e) => setEvidenceType(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white focus:outline-none"
              >
                <option value="CCTV Footage">CCTV Video Footage</option>
                <option value="Images">Crime Scene Images</option>
                <option value="Witness Statement">Witness Statement (PDF/Doc)</option>
                <option value="Audio recording">Audio Recording / Call Log</option>
                <option value="Forensic report">Forensic Lab Audit Report</option>
              </select>
            </div>

            {evidenceType === 'Witness Statement' && (
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Witness Full Name</label>
                <input 
                  type="text"
                  value={witnessName}
                  onChange={(e) => setWitnessName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Audit Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Include item metadata, capture timestamps, or lab seal numbers..."
                className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Attach Binary Files</label>
              <div className="mt-2 border border-dashed border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center gap-1 hover:border-govgold transition cursor-pointer text-center bg-slate-950">
                <UploadCloud className="w-6 h-6 text-slate-500" />
                <span className="text-[10px] font-semibold text-slate-450">Browse secure files</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-govgold hover:bg-yellow-500 text-govnavy rounded-xl text-xs font-bold uppercase tracking-wider transition border-b-4 border-yellow-700 disabled:opacity-50"
            >
              {submitting ? 'Uploading Evidence...' : 'Commit Evidence File'}
            </button>
          </form>
        </div>

        {/* Evidence Ledger */}
        <div className="lg:col-span-7 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-sm">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-850 pb-3 mb-4">
            Committed Evidence Files Directory
          </h3>

          <div className="max-h-[440px] overflow-y-auto divide-y divide-slate-850 border border-slate-850 rounded-2xl">
            {uploadedRecords.map((rec, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-950/40 transition">
                <div className="space-y-1 text-left">
                  <span className="text-[9px] text-govgold font-mono font-bold">Case Link: {rec.caseId}</span>
                  <h4 className="text-xs font-bold text-white leading-normal">{rec.type}</h4>
                  <p className="text-[10px] text-slate-500 font-semibold">{rec.desc}</p>
                </div>
                <div className="text-right flex-shrink-0 flex items-center gap-1.5 text-[10px] font-bold text-green-500">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Linked
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
