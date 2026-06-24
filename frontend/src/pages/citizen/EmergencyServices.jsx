import React from 'react'
import { Phone, Shield, ShieldAlert, Heart, Info } from 'lucide-react'

export default function EmergencyServices() {
  const contacts = [
    { title: "National Emergency Service (KSP Patrol)", number: "112", desc: "For urgent crime report logs, fire beats, or public safety emergencies.", icon: <Shield className="w-6 h-6 text-red-650" />, bg: "bg-red-50/50 border-red-200" },
    { title: "State Health Ambulance Services", number: "108", desc: "Integrated medical rescue squads, accident first response, and transfers.", icon: <Heart className="w-6 h-6 text-red-500" />, bg: "bg-orange-50/50 border-orange-200" },
    { title: "Women Abuse Support Helpline", number: "1091", desc: "Nodal hotline supporting safety alerts, transport beads, or harassment.", icon: <ShieldAlert className="w-6 h-6 text-purple-650" />, bg: "bg-purple-50/50 border-purple-200" },
    { title: "Child Nodal Helpline Coordinator", number: "1098", desc: "Coordinates emergency action logs for child protection or missing cases.", icon: <Info className="w-6 h-6 text-blue-650" />, bg: "bg-blue-50/50 border-blue-200" },
    { title: "National Cyber Fraud Reporting Nodal Cell", number: "1930", desc: "Call within 24 hours of bank transaction fraud to freeze target accounts.", icon: <Shield className="w-6 h-6 text-slate-700" />, bg: "bg-slate-50 border-slate-350" }
  ]

  return (
    <div className="space-y-6 select-none max-w-3xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 w-full h-1 bg-govpurple"></div>
        <div className="space-y-2">
          <h2 className="text-base font-bold text-govnavy uppercase tracking-wide border-l-4 border-govpurple pl-3">Emergency Contact Directory</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Quick access lines connected directly to dispatch headquarters</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {contacts.map((c) => (
          <div key={c.number} className={`border rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 transition ${c.bg}`}>
            <div className="flex items-center gap-3.5 text-left w-full sm:w-auto">
              <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-inner flex-shrink-0">{c.icon}</div>
              <div>
                <h3 className="font-extrabold text-govnavy text-xs md:text-sm">{c.title}</h3>
                <p className="text-[11px] text-slate-500 font-semibold mt-1 leading-normal">{c.desc}</p>
              </div>
            </div>
            <a href={`tel:${c.number}`} className="w-full sm:w-auto text-center px-6 py-3 bg-white text-slate-800 hover:bg-slate-55 border border-slate-300 rounded-xl font-bold font-mono text-base transition flex items-center justify-center gap-2 shadow-sm">
              <Phone className="w-4 h-4 text-red-500 animate-pulse" />
              {c.number}
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
