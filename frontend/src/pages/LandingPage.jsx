import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import HeroMap from '../components/maps/HeroMap'
import { Shield, BookOpen, PhoneCall, AlertCircle, LogIn, Map, Landmark } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export default function LandingPage({ language }) {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  
  const [summary, setSummary] = useState({ total_crimes: 10000, active_cases: 7910, closed_cases: 2090, high_severity_cases: 4105 })
  const [districts, setDistricts] = useState([])
  const [hotspots, setHotspots] = useState([])

  // Auto redirection if already logged in
  useEffect(() => {
    if (profile) {
      if (profile.role === 'Citizen') navigate('/citizen', { replace: true })
      else if (profile.role === 'Police Officer') navigate('/officer', { replace: true })
      else if (profile.role === 'Government Official') navigate('/government', { replace: true })
    }
  }, [profile, navigate])

  useEffect(() => {
    async function loadStats() {
      try {
        const [summaryRes, districtsRes, hotspotsRes] = await Promise.all([
          fetch(`${API_BASE}/analytics/summary`).then((res) => res.json()).catch(() => null),
          fetch(`${API_BASE}/analytics/crimes-by-district`).then((res) => res.json()).catch(() => []),
          fetch(`${API_BASE}/analytics/hotspots`).then((res) => res.json()).catch(() => ({ hotspots: [] })),
        ])
        
        if (summaryRes) setSummary(summaryRes)
        if (Array.isArray(districtsRes)) setDistricts(districtsRes)
        if (hotspotsRes && Array.isArray(hotspotsRes.hotspots)) setHotspots(hotspotsRes.hotspots)
      } catch (error) {
        console.error("Failed to load landing statistics:", error)
      }
    }
    loadStats()
  }, [])

  const handleScrollToPortals = () => {
    const el = document.getElementById('portals')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="space-y-12 py-6 select-none bg-slate-50 min-h-screen">
      {/* 1. Header Banner */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-sm grid gap-8 lg:grid-cols-12 items-center">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-govnavy"></div>
        <div className="absolute top-1.5 left-0 w-full h-1 bg-govgold"></div>

        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-250 text-[10px] font-bold text-govnavy rounded-full uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5 text-govgold" />
            Karnataka State Security Information Portal
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black text-govnavy leading-tight tracking-tight uppercase">
            Karnataka Crime Intelligence & Analytical Platform
          </h1>
          
          <p className="text-slate-605 text-sm md:text-base leading-relaxed font-semibold">
            AI Powered Crime Prevention, Investigation and Governance. This portal coordinates safety notices for citizens and serves as the primary gateway for authorized police and government officials.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={handleScrollToPortals}
              className="px-6 py-3.5 bg-govnavy text-white hover:bg-slate-800 rounded-xl font-bold text-xs uppercase tracking-wider transition border-b-4 border-slate-950 flex items-center gap-2 shadow"
            >
              <LogIn className="w-4 h-4 text-govgold" />
              Secure Login Gateway
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 h-[400px]">
          <HeroMap hotspots={hotspots} districtStats={districts} />
        </div>
      </section>

      {/* 2. Login Gateways Grid */}
      <section id="portals" className="space-y-4 scroll-mt-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-base font-extrabold text-govnavy uppercase tracking-wider">Operational Portal Logins</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-wider">Click to authenticate and access your designated command center</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow transition duration-200 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-govpurple"></div>
            <div className="space-y-3">
              <span className="text-[9px] text-govpurple font-bold uppercase tracking-wider">Public Access</span>
              <h3 className="text-sm font-bold text-govnavy">Citizen Services</h3>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">Report non-emergency complaints, track timelines, safety map grids, and helpline guides.</p>
            </div>
            <button onClick={() => navigate('/login/citizen')} className="w-full mt-6 py-2.5 bg-slate-50 hover:bg-govpurple hover:text-white border rounded-xl text-xs font-bold uppercase tracking-wider transition">
              Citizen Login
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow transition duration-200 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-govgold"></div>
            <div className="space-y-3">
              <span className="text-[9px] text-govgold font-bold uppercase tracking-wider">Restricted Access</span>
              <h3 className="text-sm font-bold text-govnavy">Police Operations Center</h3>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">Secure terminal for investigating officers. Manage FIR details, case mapping, and linkages analysis.</p>
            </div>
            <button onClick={() => navigate('/login/officer')} className="w-full mt-6 py-2.5 bg-slate-50 hover:bg-govgold hover:text-govnavy border rounded-xl text-xs font-bold uppercase tracking-wider transition border-b-2">
              Officer Login
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow transition duration-200 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-govblue"></div>
            <div className="space-y-3">
              <span className="text-[9px] text-govblue font-bold uppercase tracking-wider">Restricted Access</span>
              <h3 className="text-sm font-bold text-govnavy">State Crime Command Center</h3>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">Decision planning board for government officials. Audit resource allocation recommendation reports.</p>
            </div>
            <button onClick={() => navigate('/login/government')} className="w-full mt-6 py-2.5 bg-slate-50 hover:bg-govblue hover:text-white border rounded-xl text-xs font-bold uppercase tracking-wider transition">
              Government Login
            </button>
          </div>
        </div>
      </section>

      {/* 3. Safety Awareness Advisories */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-govnavy uppercase tracking-wide border-l-4 border-govgold pl-3">
          State Public Advisories
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm text-xs space-y-2">
            <div className="flex items-center gap-2 text-govnavy">
              <BookOpen className="w-4 h-4 text-govgold" />
              <strong className="font-extrabold text-xs">Phishing Alert: KYC Upgrades</strong>
            </div>
            <p className="text-slate-500 font-semibold leading-normal">
              Beware of callers requesting bank KYC upgrades. Karnataka Police does not verify accounts over telephone beats.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm text-xs space-y-2">
            <div className="flex items-center gap-2 text-govnavy">
              <BookOpen className="w-4 h-4 text-govgold" />
              <strong className="font-extrabold text-xs">UPI Collect Scams Warnings</strong>
            </div>
            <p className="text-slate-500 font-semibold leading-normal">
              Entering UPI PIN is only required to deduct money from your account. Never input PINs to receive refunds.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm text-xs space-y-2">
            <div className="flex items-center gap-2 text-govnavy">
              <BookOpen className="w-4 h-4 text-govgold" />
              <strong className="font-extrabold text-xs">Job Offer Deposit Warning</strong>
            </div>
            <p className="text-slate-500 font-semibold leading-normal">
              Do not deposit commissions/fees to recruitment agencies promising government jobs without verifying registry seals.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Emergency hotline directory */}
      <section className="bg-red-50 border border-red-200 p-5 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold">
        <div className="flex items-center gap-3 text-red-800 text-left">
          <PhoneCall className="w-6 h-6 animate-pulse text-red-600" />
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wide">Emergency First Responder Rescue</h4>
            <p className="text-[10px] text-red-650 leading-relaxed font-semibold">Dial 112 for rapid police dispatches, fires, or medical rescue beats.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <a href="tel:112" className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 shadow-sm transition">Call 112</a>
          <a href="tel:1930" className="px-4 py-2 bg-slate-805 text-white rounded-lg font-bold hover:bg-slate-900 shadow-sm transition">Report Cyber Scams (1930)</a>
        </div>
      </section>
    </div>
  )
}
