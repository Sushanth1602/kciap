import React from 'react'
import { Shield, Bell, PhoneCall, CheckCircle, AlertCircle, AlertTriangle, BookOpen } from 'lucide-react'

export default function CitizenDashboard() {
  return (
    <div className="space-y-8 select-none">
      {/* Banner */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 w-full h-1 bg-govpurple"></div>
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-purple-50 border border-purple-100 text-[9px] font-bold text-govpurple rounded uppercase tracking-wider">
            State Security Advisory
          </span>
          <h2 className="text-xl font-bold text-govnavy">Citizen Dashboard Overview</h2>
          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
            Welcome to the secure citizen nodal interface. Stay updated with state-wide safety alerts, review fraud warnings, and access rapid-response emergency coordination services.
          </p>
        </div>
      </section>

      {/* Grid: Announcements / Emergency */}
      <div className="grid gap-6 md:grid-cols-12 items-start">
        {/* Left: Notices and announcements */}
        <div className="md:col-span-8 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-govnavy uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <Bell className="w-4 h-4 text-govpurple animate-bounce" />
              Public Announcements & Advisories
            </h3>
            
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 relative overflow-hidden">
                <div className="absolute left-0 top-0 h-full w-1 bg-govpurple"></div>
                <div className="flex justify-between items-start mb-2">
                  <strong className="text-govnavy">Special beat patrol in South Bengaluru Division</strong>
                  <span className="text-[9px] text-slate-400 font-semibold">10 hours ago</span>
                </div>
                <p className="text-slate-500 font-medium leading-relaxed">
                  Additional patrol squads have been mobilized in residential lanes to curb theft during late night beats. Dial 112 to report suspicious movements.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 relative overflow-hidden">
                <div className="absolute left-0 top-0 h-full w-1 bg-amber-500"></div>
                <div className="flex justify-between items-start mb-2">
                  <strong className="text-govnavy">Urgent Warning: Fake Electricity Bill Payment Scams</strong>
                  <span className="text-[9px] text-slate-400 font-semibold">1 day ago</span>
                </div>
                <p className="text-slate-500 font-medium leading-relaxed">
                  Scammers are sending SMS threats to suspend connections unless payments are made immediately via linked APK/UPI files. KSP advises not to click any links or share PINs.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Helpline & Checklist */}
        <div className="md:col-span-4 space-y-6">
          {/* Quick Helplines */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-govnavy uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <PhoneCall className="w-4 h-4 text-red-500" />
              Immediate Rescue Helplines
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-red-50/50 border border-red-100 px-3 py-2 rounded-xl text-xs">
                <div>
                  <p className="font-bold text-red-800">Police Emergency</p>
                  <span className="text-[9px] text-slate-400 font-semibold">National Support</span>
                </div>
                <a href="tel:112" className="px-3 py-1 bg-red-650 text-white rounded font-mono font-bold hover:bg-red-700">112</a>
              </div>

              <div className="flex justify-between items-center bg-slate-50 border border-slate-150 px-3 py-2 rounded-xl text-xs">
                <div>
                  <p className="font-bold text-govnavy">Cyber Crime Cells</p>
                  <span className="text-[9px] text-slate-400 font-semibold">Financial Fraud Alert</span>
                </div>
                <a href="tel:1930" className="px-3 py-1 bg-slate-800 text-white rounded font-mono font-bold hover:bg-slate-900">1930</a>
              </div>
            </div>
          </div>

          {/* Safety notices Checklist */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 text-xs">
            <h3 className="text-xs font-bold text-govnavy uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <Shield className="w-4 h-4 text-green-600" />
              Citizen Safety Measures
            </h3>
            <ul className="space-y-2.5 text-slate-600 font-semibold leading-relaxed">
              <li className="flex gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Register grievances via our encrypted online portal logs.</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Review safe zones classifications before late transit beats.</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Keep emergency contacts speed-dialed on mobile registers.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
