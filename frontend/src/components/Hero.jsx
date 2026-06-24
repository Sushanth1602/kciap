import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Hero() {
  const navigate = useNavigate()
  return (
    <div className="bg-gradient-to-r from-sky-700 to-indigo-700 text-white py-20">
      <div className="mx-auto max-w-7xl px-4 text-center">
        <h1 className="mb-4 text-4xl font-bold">Karnataka Crime Intelligence & Analytical Platform</h1>
        <p className="mb-6 text-lg">AI-Powered Crime Analytics, Hotspot Detection, and Strategic Policing</p>
        <div className="flex justify-center gap-4">
          <button onClick={() => navigate('/citizen')} className="rounded-2xl bg-white/90 text-slate-900 px-6 py-3 font-semibold">Citizen Portal</button>
          <button onClick={() => navigate('/login')} className="rounded-2xl bg-white/30 border border-white/40 px-6 py-3 font-semibold">Officer Login</button>
          <button onClick={() => navigate('/government')} className="rounded-2xl bg-white/30 border border-white/40 px-6 py-3 font-semibold">Government Dashboard</button>
        </div>
      </div>
    </div>
  )
}
