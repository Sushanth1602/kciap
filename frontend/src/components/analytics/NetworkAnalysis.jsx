import React, { useState } from 'react'
import { Link2, Users, Search, AlertCircle } from 'lucide-react'

function NetworkAnalysis({ apiBase }) {
  const [suspectId, setSuspectId] = useState('S1001')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!suspectId.trim()) return
    setError('')
    setLoading(true)
    try {
      const response = await fetch(`${apiBase}/network/${suspectId}`)
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail || 'Network link database returned no results')
      }
      const payload = await response.json()
      setResult(payload)
    } catch (err) {
      setResult(null)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
        <h2 className="mb-4 text-lg font-bold text-govnavy uppercase tracking-wide border-l-4 border-govgold pl-3 flex items-center gap-2">
          <Link2 className="w-5 h-5 text-govblue" />
          Suspect Criminal Network Linkage
        </h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-grow">
            <label className="mb-2 block text-xs font-semibold text-slate-500 uppercase tracking-wider">Target Suspect ID</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                <Search className="w-4 h-4" />
              </span>
              <input
                value={suspectId}
                onChange={(event) => setSuspectId(event.target.value)}
                placeholder="e.g. S1001"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="rounded-xl bg-govnavy text-white hover:bg-slate-800 px-6 py-2.5 text-sm font-semibold transition border-b-4 border-slate-950 disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Map Relationships'}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 border border-red-100 p-5 text-red-700 text-xs font-semibold flex items-start gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>Error loading network graph: {error}</span>
        </div>
      )}

      {result && (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Identified Suspect</p>
            <p className="mt-2 text-xl font-bold text-govnavy">{result.suspect_id}</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Direct Connected Crimes</p>
            <p className="mt-2 text-xl font-bold text-govblue">{result.connected_crimes.length} incidents</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-semibold">Associated Victims</p>
            <p className="mt-2 text-xl font-bold text-indigo-700">{result.connected_victims.length} contacts</p>
          </div>
        </div>
      )}

      {result && (
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 space-y-5">
          <h3 className="text-sm font-bold text-govnavy uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4 text-govgold" />
            Intelligence Association Linkage Map
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Co-Linked Case Incidents</p>
              <div className="max-h-40 overflow-y-auto border border-slate-100 rounded-xl divide-y divide-slate-100 text-xs">
                {result.connected_crimes.map((crimeId) => (
                  <div key={crimeId} className="px-4 py-2.5 font-semibold text-slate-700 hover:bg-slate-50 flex justify-between items-center">
                    <span>Incident Case file</span>
                    <strong className="text-govblue font-mono font-bold">{crimeId}</strong>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider font-semibold">Co-Linked Victims Directory</p>
              <div className="max-h-40 overflow-y-auto border border-slate-100 rounded-xl divide-y divide-slate-100 text-xs">
                {result.connected_victims.map((victimId) => (
                  <div key={victimId} className="px-4 py-2.5 font-semibold text-slate-700 hover:bg-slate-50 flex justify-between items-center">
                    <span>Victim ID</span>
                    <strong className="text-indigo-700 font-mono font-bold">{victimId}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NetworkAnalysis
