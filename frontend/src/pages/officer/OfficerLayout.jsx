import React from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Shield, Home, FileText, Briefcase, Camera, Map, AlertTriangle, Link2, Search, Bot, LogOut, Users, Bell, User, Cpu } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function OfficerLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { signOut, profile } = useAuth()

  const isActive = (path) => {
    if (path === '/officer') {
      return location.pathname === '/officer' || location.pathname === '/officer/'
    }
    return location.pathname.startsWith(path)
  }

  const navLinkClass = (path) => {
    return `flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition ${
      isActive(path)
        ? 'bg-govgold text-govnavy'
        : 'text-slate-400 hover:bg-slate-900 hover:text-govgold'
    }`
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#0B1220] text-slate-350 rounded-3xl border border-slate-900 overflow-hidden shadow-xl">
      {/* Sidebar navigation */}
      <aside className="w-full md:w-64 bg-[#070D19] border-r border-slate-850 flex flex-col justify-between shrink-0">
        <div className="p-5 space-y-6 overflow-y-auto no-scrollbar max-h-[85vh]">
          <div className="flex items-center gap-2 border-b border-slate-850 pb-4">
            <div className="p-2 bg-govgold/10 rounded-xl text-govgold border border-govgold/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">KSP Operations Center</h2>
              <span className="text-[9px] text-govgold font-bold uppercase tracking-wider">Nodal command desk</span>
            </div>
          </div>

          {/* Nav groups */}
          <div className="space-y-4 text-left">
            {/* Group 1: Base */}
            <div className="space-y-1">
              <Link to="/officer" className={navLinkClass('/officer')}>
                <Home className="w-3.5 h-3.5" />
                Duty Dashboard
              </Link>
            </div>

            {/* Group 2: Operations */}
            <div className="space-y-1">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider px-3">Operations</span>
              <Link to="/officer/fir" className={navLinkClass('/officer/fir')}>
                <FileText className="w-3.5 h-3.5" />
                FIR Management
              </Link>
              <Link to="/officer/cases" className={navLinkClass('/officer/cases')}>
                <Briefcase className="w-3.5 h-3.5" />
                Case Management
              </Link>
              <Link to="/officer/evidence" className={navLinkClass('/officer/evidence')}>
                <Camera className="w-3.5 h-3.5" />
                Evidence Logs
              </Link>
            </div>

            {/* Group 3: Intelligence */}
            <div className="space-y-1">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider px-3">Intelligence</span>
              <Link to="/officer/map" className={navLinkClass('/officer/map')}>
                <Map className="w-3.5 h-3.5" />
                Crime Mapping
              </Link>
              <Link to="/officer/hotspots" className={navLinkClass('/officer/hotspots')}>
                <AlertTriangle className="w-3.5 h-3.5" />
                Threat Hotspots
              </Link>
              <Link to="/officer/network" className={navLinkClass('/officer/network')}>
                <Link2 className="w-3.5 h-3.5" />
                Link Analysis
              </Link>
              <Link to="/officer/offenders" className={navLinkClass('/officer/offenders')}>
                <Users className="w-3.5 h-3.5" />
                Repeat Offenders
              </Link>
            </div>

            {/* Group 4: AI & Reports */}
            <div className="space-y-1">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider px-3">AI & Reports</span>
              <Link to="/officer/ai" className={navLinkClass('/officer/ai')}>
                <Bot className="w-3.5 h-3.5" />
                AI Investigator
              </Link>
              <Link to="/officer/reports" className={navLinkClass('/officer/reports')}>
                <Cpu className="w-3.5 h-3.5" />
                Report Generator
              </Link>
            </div>

            {/* Group 5: Administration */}
            <div className="space-y-1">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider px-3">Administration</span>
              <Link to="/officer/notifications" className={navLinkClass('/officer/notifications')}>
                <Bell className="w-3.5 h-3.5" />
                Alert Notifications
              </Link>
              <Link to="/officer/profile" className={navLinkClass('/officer/profile')}>
                <User className="w-3.5 h-3.5" />
                Officer Profile
              </Link>
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-slate-850 space-y-4 flex-shrink-0">
          {profile && (
            <div className="flex items-center gap-3 text-xs bg-slate-900/60 p-2.5 rounded-xl border border-slate-850">
              <div className="w-8 h-8 rounded-full bg-govgold/10 text-govgold font-bold flex items-center justify-center border border-govgold/20 uppercase text-xs">
                {profile.full_name?.charAt(0) || 'O'}
              </div>
              <div className="text-left leading-normal">
                <p className="font-bold text-slate-200">{profile.full_name}</p>
                <span className="text-[9px] text-govgold uppercase font-bold tracking-wider">KSP-{profile.phone?.slice(-4) || '8023'}</span>
              </div>
            </div>
          )}
          <button
            onClick={() => signOut().then(() => navigate('/'))}
            className="w-full py-2 px-4 border border-slate-800 hover:border-red-900 text-red-400 hover:bg-red-950/20 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-grow p-6 overflow-y-auto max-h-screen">
        <Outlet />
      </main>
    </div>
  )
}
