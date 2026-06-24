import React from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Home, FileText, Search, BookOpen, PhoneCall, Map, Bot, Shield, LogOut, Settings } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function CitizenLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { signOut, profile } = useAuth()

  const navItems = [
    { path: '/citizen', name: 'Dashboard', icon: <Home className="w-4 h-4" /> },
    { path: '/citizen/report', name: 'Report Crime', icon: <FileText className="w-4 h-4" /> },
    { path: '/citizen/track', name: 'Track Complaint', icon: <Search className="w-4 h-4" /> },
    { path: '/citizen/awareness', name: 'Crime Awareness', icon: <BookOpen className="w-4 h-4" /> },
    { path: '/citizen/emergency', name: 'Emergency Services', icon: <PhoneCall className="w-4 h-4" /> },
    { path: '/citizen/map', name: 'Public Crime Map', icon: <Map className="w-4 h-4" /> },
    { path: '/citizen/ai', name: 'Citizen AI Assistant', icon: <Bot className="w-4 h-4" /> },
    { path: '/citizen/settings', name: 'Settings', icon: <Settings className="w-4 h-4" /> }
  ]

  const isActive = (path) => {
    if (path === '/citizen') {
      return location.pathname === '/citizen' || location.pathname === '/citizen/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 text-slate-800 rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Sidebar navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0">
        <div className="p-5 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <div className="p-2 bg-govpurple/10 rounded-xl text-govpurple border border-govpurple/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-govnavy uppercase tracking-wider">Public Safety Services</h2>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">KSP Civic Portal</span>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                  isActive(item.path)
                    ? 'bg-govpurple text-white'
                    : 'text-slate-650 hover:bg-slate-50 hover:text-govpurple'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-5 border-t border-slate-100 space-y-4">
          {profile && (
            <div className="flex items-center gap-3 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-155">
              <div className="w-8 h-8 rounded-full bg-govpurple/10 text-govpurple font-bold flex items-center justify-center border border-govpurple/20 uppercase text-xs">
                {profile.full_name?.charAt(0) || 'C'}
              </div>
              <div className="text-left leading-normal">
                <p className="font-bold text-slate-800">{profile.full_name}</p>
                <span className="text-[9px] text-slate-400 font-bold uppercase">Role: {profile.role}</span>
              </div>
            </div>
          )}
          <button
            onClick={() => signOut().then(() => navigate('/'))}
            className="w-full py-2 px-4 border border-slate-200 hover:border-red-300 text-red-650 hover:bg-red-50 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main panel */}
      <main className="flex-grow p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
