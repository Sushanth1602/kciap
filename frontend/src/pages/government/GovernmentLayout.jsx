import React from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Landmark, Home, Map, BarChart2, Cpu, TrendingUp, FileText, Bot, LogOut } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function GovernmentLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { signOut, profile } = useAuth()

  const navItems = [
    { path: '/government', name: 'Executive Dashboard', icon: <Home className="w-4 h-4" /> },
    { path: '/government/map', name: 'State Crime Map', icon: <Map className="w-4 h-4" /> },
    { path: '/government/analytics', name: 'District Analytics', icon: <BarChart2 className="w-4 h-4" /> },
    { path: '/government/resources', name: 'Resource Allocation', icon: <Cpu className="w-4 h-4" /> },
    { path: '/government/predictive', name: 'Predictive Intelligence', icon: <TrendingUp className="w-4 h-4" /> },
    { path: '/government/reports', name: 'Reports', icon: <FileText className="w-4 h-4" /> },
    { path: '/government/ai', name: 'AI Strategic Advisor', icon: <Bot className="w-4 h-4" /> }
  ]

  const isActive = (path) => {
    if (path === '/government') {
      return location.pathname === '/government' || location.pathname === '/government/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 text-slate-800 rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Sidebar navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0">
        <div className="p-5 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <div className="p-2 bg-govblue/10 rounded-xl text-govblue border border-govblue/20">
              <Landmark className="w-5 h-5 text-govblue" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-govnavy uppercase tracking-wider">State Crime Command Center</h2>
              <span className="text-[9px] text-govgold font-bold uppercase tracking-wider">Government Decision Support Desk</span>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                  isActive(item.path)
                    ? 'bg-govblue text-white'
                    : 'text-slate-650 hover:bg-slate-50 hover:text-govblue'
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
            <div className="flex items-center gap-3 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-150">
              <div className="w-8 h-8 rounded-full bg-govblue/10 text-govblue font-bold flex items-center justify-center border border-govblue/20 uppercase text-xs">
                {profile.full_name?.charAt(0) || 'G'}
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

      {/* Main Panel */}
      <main className="flex-grow p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
