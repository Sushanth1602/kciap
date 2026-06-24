import React, { useState, useEffect } from 'react'
import { Search, ShieldAlert, UserCheck } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export default function OfficerSuspectSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState('suspect_id') // name, suspect_id, crime_type, district
  const [crimes, setCrimes] = useState([])
  const [results, setResults] = useState([])
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    fetch(`${API_BASE}/crimes`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCrimes(data)
      })
      .catch(console.error)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    setSearched(true)
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    const query = searchQuery.toLowerCase()
    const matches = crimes.filter((c) => {
      if (searchType === 'suspect_id') return c.suspect_id.toLowerCase().includes(query)
      if (searchType === 'crime_type') return c.crime_type.toLowerCase().includes(query)
      if (searchType === 'district') return c.district.toLowerCase().includes(query)
      // Name fallback/station
      return c.police_station.toLowerCase().includes(query)
    })

    setResults(matches)
  }

  return (
    <div className="space-y-6 select-none text-slate-350 max-w-4xl mx-auto">
      {/* Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 w-full h-1 bg-govgold"></div>
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-govgold/10 rounded-xl text-govgold border border-govgold/20">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wide">Suspect Query Ledger</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Lookup active criminal profiles and co-linked case details</p>
          </div>
        </div>
      </div>

      {/* Search Bar Panel */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-bold uppercase"
          >
            <option value="suspect_id">Suspect ID Code</option>
            <option value="crime_type">Crime Type</option>
            <option value="district">District</option>
            <option value="name">Station / Officers</option>
          </select>
          
          <input
            type="text"
            placeholder="Search by suspect ID code or category keywords..."
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

      {/* Results grid */}
      {searched && (
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Identified Matches</h3>
          
          {results.length === 0 ? (
            <p className="text-xs text-slate-500 font-medium py-4 text-center">No criminal records match the search query.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {results.slice(0, 10).map((criminal) => (
                <div key={criminal.crime_id} className="p-4 bg-slate-950 rounded-xl border border-slate-850 space-y-2 text-xs">
                  <div className="flex justify-between items-center border-b border-slate-850 pb-2 mb-2">
                    <div className="flex items-center gap-1.5 text-govgold font-mono font-bold">
                      <UserCheck className="w-4 h-4 text-govgold" />
                      {criminal.suspect_id}
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                      criminal.status === 'Closed' ? 'bg-green-950 text-green-400 border border-green-500/10' : 'bg-orange-950 text-orange-450 border border-orange-500/10'
                    }`}>
                      {criminal.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-slate-400">
                    <p className="text-white"><strong>Linked Case:</strong> {criminal.crime_type}</p>
                    <p><strong>District:</strong> {criminal.district}</p>
                    <p><strong>Police Station:</strong> {criminal.police_station}</p>
                    <p><strong>Modus Operandi:</strong> {criminal.modus_operandi}</p>
                    <p className="text-[10px] text-slate-500"><strong>Occurrence:</strong> {criminal.crime_date} {criminal.crime_time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
