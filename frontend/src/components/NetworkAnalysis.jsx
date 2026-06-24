import { useState } from 'react'

function NetworkAnalysis({ apiBase }) {
  const [suspectId, setSuspectId] = useState('S1001')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleSearch = async () => {
    setError('')
    try {
      const response = await fetch(`${apiBase}/network/${suspectId}`)
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail || 'Network data unavailable')
      }
      const payload = await response.json()
      setResult(payload)
    } catch (err) {
      setResult(null)
      setError(err.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Suspect Network Analysis</h2>
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-slate-700">Suspect ID</label>
            <input
              value={suspectId}
              onChange={(event) => setSuspectId(event.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500"
            />
          </div>
          <button
            onClick={handleSearch}
            className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Load Network
          </button>
        </div>
      </div>
      {error && (
        <div className="rounded-3xl bg-rose-50 p-6 text-rose-700 shadow-sm">Error: {error}</div>
      )}
      {result && (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Suspect ID</p>
            <p className="mt-3 text-xl font-semibold text-slate-900">{result.suspect_id}</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Connected Crimes</p>
            <p className="mt-3 text-xl font-semibold text-slate-900">{result.connected_crimes.length}</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Connected Victims</p>
            <p className="mt-3 text-xl font-semibold text-slate-900">{result.connected_victims.length}</p>
          </div>
        </div>
      )}
      {result && (
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">Network Summary</h3>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-medium text-slate-600">Connected Crimes</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
                {result.connected_crimes.slice(0, 8).map((crimeId) => (
                  <li key={crimeId}>{crimeId}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-slate-600">Connected Victims</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
                {result.connected_victims.slice(0, 8).map((victimId) => (
                  <li key={victimId}>{victimId}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NetworkAnalysis
