import React from 'react'
import { Shield, AlertTriangle, Heart, Users, BookOpen, AlertCircle } from 'lucide-react'

export default function CrimeAwareness() {
  const cards = [
    { title: "Cyber Fraud Alerts", desc: "Never share OTP values, login codes, or bank passwords with callers claiming to represent security divisions.", icon: <Shield className="w-5 h-5 text-indigo-650" /> },
    { title: "UPI Payment Safety", desc: "Remember: UPI PIN is only required to SEND payments, never to RECEIVE money. Cancel suspicious collect-requests.", icon: <AlertTriangle className="w-5 h-5 text-amber-500" /> },
    { title: "Women Protection Measures", desc: "Keep local safety squad speed-dials mapped. Utilise Karnataka KSP Suraksha applications for live monitoring.", icon: <Heart className="w-5 h-5 text-pink-500" /> },
    { title: "Child Helpline Network", desc: "Direct nodal reporting controls against abuse, child labor exploitation, and school precinct safety.", icon: <BookOpen className="w-5 h-5 text-blue-650" /> },
    { title: "Senior Citizen Nodal Support", desc: "Beware of pension verify scams or medical fraud audits. KSP checkpoints provide regular elder safety rounds.", icon: <Users className="w-5 h-5 text-teal-650" /> },
    { title: "Job Scams & Fake Agencies", desc: "Verify recruiting firms registration credentials. Never deposit advance commissions for job placement approvals.", icon: <AlertCircle className="w-5 h-5 text-rose-500" /> }
  ]

  return (
    <div className="space-y-6 select-none max-w-4xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 w-full h-1 bg-govpurple"></div>
        <div className="space-y-2">
          <h2 className="text-base font-bold text-govnavy uppercase tracking-wide border-l-4 border-govpurple pl-3">Crime Awareness Center</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Advisories & prevention matrices compiled by state security units</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow hover:border-govpurple transition duration-200">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">{card.icon}</div>
              <h3 className="font-extrabold text-govnavy text-xs md:text-sm leading-tight">{card.title}</h3>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-semibold mt-3.5">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
