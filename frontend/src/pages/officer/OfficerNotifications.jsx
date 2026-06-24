import React, { useState } from 'react'
import { Bell, ShieldAlert, Clock, Check, X, Shield, Volume2 } from 'lucide-react'

export default function OfficerNotifications() {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      time: '01:15',
      type: 'CRITICAL',
      msg: 'Cyber Crime Cell flagged 4 suspect UPI transactions under Bengaluru Urban.',
      category: 'Cyber Fraud'
    },
    {
      id: 2,
      time: '01:08',
      type: 'ALERT',
      msg: 'New evidence uploaded for Case CR-8902 by Duty Inspector.',
      category: 'Evidence Log'
    },
    {
      id: 3,
      time: '00:52',
      type: 'INFO',
      msg: 'Emergency dial call received from citizen under sector Mysuru Division. Patrol car 3 deployed.',
      category: '112 Dispatch'
    },
    {
      id: 4,
      time: '00:15',
      type: 'ALERT',
      msg: 'Suspect network map modified. Suspicious relationship cluster identified for suspect SUS-9021.',
      category: 'Intelligence'
    }
  ])

  const handleDismiss = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id))
  }

  const handleClearAll = () => {
    setAlerts([])
  }

  const getTypeBadge = (type) => {
    switch (type) {
      case 'CRITICAL':
        return (
          <span className="px-2 py-0.5 rounded font-bold uppercase text-[9px] bg-red-950/80 text-red-400 border border-red-900/30">
            Critical
          </span>
        )
      case 'ALERT':
        return (
          <span className="px-2 py-0.5 rounded font-bold uppercase text-[9px] bg-amber-950/80 text-amber-400 border border-amber-900/30">
            Alert
          </span>
        )
      default:
        return (
          <span className="px-2 py-0.5 rounded font-bold uppercase text-[9px] bg-blue-950/80 text-blue-400 border border-blue-900/30">
            Info
          </span>
        )
    }
  }

  return (
    <div className="space-y-6 select-none text-slate-350 text-left max-w-4xl mx-auto">
      {/* Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-sm flex items-center justify-between gap-4">
        <div className="absolute top-0 left-0 w-full h-1 bg-govgold"></div>
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-govgold/10 rounded-xl text-govgold border border-govgold/20">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wide">Live Dispatch Notifications</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
              Real-time feed from regional division control rooms and beat logs
            </p>
          </div>
        </div>
        {alerts.length > 0 && (
          <button
            onClick={handleClearAll}
            className="px-3 py-1.5 border border-slate-800 hover:border-slate-700 bg-slate-950 hover:bg-slate-900 rounded-xl text-[10px] font-bold uppercase tracking-wider transition"
          >
            Clear All Alerts
          </button>
        )}
      </div>

      {alerts.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-16 text-center text-slate-500 font-semibold uppercase text-xs space-y-3 flex flex-col items-center justify-center">
          <Shield className="w-12 h-12 text-slate-850" />
          <span>All dispatcher queues clear. No alerts pending.</span>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((a) => (
            <div
              key={a.id}
              className="bg-slate-900/50 border border-slate-805 hover:border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4 hover:bg-slate-950/20 transition relative overflow-hidden group"
            >
              <div className="flex gap-4 items-start">
                <div className="p-2 bg-slate-950 rounded-xl border border-slate-850 text-govgold shrink-0 mt-0.5">
                  <Volume2 className="w-4 h-4" />
                </div>
                
                <div className="space-y-1 text-left text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-govgold font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {a.time}
                    </span>
                    <span className="text-slate-500 font-bold uppercase tracking-wider text-[9px]">• Sector: {a.category}</span>
                    {getTypeBadge(a.type)}
                  </div>
                  <p className="text-slate-300 font-semibold leading-relaxed mt-1">{a.msg}</p>
                </div>
              </div>

              <button
                onClick={() => handleDismiss(a.id)}
                className="p-1.5 border border-slate-850 hover:border-red-900/40 text-slate-500 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
