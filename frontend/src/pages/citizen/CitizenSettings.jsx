import React from 'react'
import { Settings, Shield, User } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function CitizenSettings() {
  const { profile } = useAuth()

  return (
    <div className="space-y-6 select-none max-w-2xl mx-auto text-slate-700">
      {/* Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 w-full h-1 bg-govpurple"></div>
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-govpurple/10 rounded-xl text-govpurple border border-govpurple/20">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-govnavy uppercase tracking-wide">Account Settings</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Manage credentials and alert preferences</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 text-xs md:text-sm">
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-govnavy uppercase tracking-wider border-b pb-2 flex items-center gap-1.5">
            <User className="w-4 h-4 text-govpurple" />
            Profile Information
          </h3>
          <div className="grid grid-cols-2 gap-4 text-slate-500 font-semibold leading-normal">
            <div>
              <span>Full Name</span>
              <p className="text-govnavy font-bold text-xs mt-0.5">{profile?.full_name || 'Guest Citizen'}</p>
            </div>
            <div>
              <span>Email Address</span>
              <p className="text-govnavy font-bold text-xs mt-0.5">{profile?.email || 'guest-citizen@karnataka.gov.in'}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-xs font-bold text-govnavy uppercase tracking-wider border-b pb-2 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-govpurple" />
            Security & Alerts
          </h3>
          <div className="space-y-3 font-semibold text-slate-650">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded border-slate-300 text-govpurple focus:ring-purple-500 w-4 h-4" />
              <span>Receive SMS safety advisories for critical hotspot alerts.</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded border-slate-300 text-govpurple focus:ring-purple-500 w-4 h-4" />
              <span>Subscribe to monthly KSP crime trend bulletin emails.</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
