import React from 'react'
import { User, Shield, Landmark, MapPin, Phone, ShieldAlert, Award, FileText } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function OfficerProfile() {
  const { profile } = useAuth()

  // Generate fallback/mock badge details if not present in profile db
  const officerName = profile?.full_name || 'Inspector K. S. Gowda'
  const officerPhone = profile?.phone || '+91 98450 12345'
  const badgeId = `KSP-INSP-${profile?.phone?.slice(-4) || '8902'}`
  
  return (
    <div className="space-y-6 select-none text-slate-350 text-left max-w-4xl mx-auto">
      {/* Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 w-full h-1 bg-govgold"></div>
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-govgold/10 rounded-xl text-govgold border border-govgold/20">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wide">Officer Profile & Credentials</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
              Secure identity card and clearance verification parameters
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left: Badge Display */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-between relative overflow-hidden text-center min-h-[320px]">
          <div className="absolute top-0 left-0 w-full h-1 bg-govgold"></div>
          
          <div className="space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-govgold/10 border-2 border-govgold flex items-center justify-center text-govgold">
              <Shield className="w-10 h-10" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-white font-extrabold text-sm uppercase tracking-wide">{officerName}</h3>
              <p className="text-[10px] text-govgold font-bold uppercase tracking-wider">Inspector of Police</p>
              <span className="inline-flex mt-1 px-2.5 py-0.5 bg-slate-950 border border-slate-800 rounded text-[9px] font-mono text-slate-400 font-bold">
                {badgeId}
              </span>
            </div>
          </div>

          <div className="w-full bg-slate-950 p-3.5 border border-slate-850 rounded-2xl text-[9px] font-mono leading-normal text-slate-500">
            <p className="font-bold text-govgold uppercase">CLEARANCE: LEVEL-4</p>
            <p className="mt-1">KSP CENTRAL SYSTEM PROTOCOL VERIFIED</p>
          </div>
        </div>

        {/* Right: Administrative Details */}
        <div className="md:col-span-2 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-850 pb-3 flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-govgold" />
              Station & Division Assignment
            </h3>

            <div className="grid gap-4 sm:grid-cols-2 text-xs">
              <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-2xl space-y-1.5">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-govgold" />
                  Primary Jurisdiction
                </span>
                <p className="text-white font-bold">Bengaluru South Division</p>
                <p className="text-[10px] text-slate-500 font-semibold">Beat Sector: 4A (Electronic City)</p>
              </div>

              <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-2xl space-y-1.5">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Phone className="w-3 h-3 text-govgold" />
                  Operational Mobile
                </span>
                <p className="text-white font-bold">{officerPhone}</p>
                <p className="text-[10px] text-slate-500 font-semibold">CUG encrypted beat line</p>
              </div>

              <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-2xl space-y-1.5">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3 text-red-500" />
                  Duty Desk Assignment
                </span>
                <p className="text-white font-bold">Cyber Crimes Nodal Center</p>
                <p className="text-[10px] text-slate-500 font-semibold">Shift: Morning Duty Alpha</p>
              </div>

              <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-2xl space-y-1.5">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Award className="w-3 h-3 text-govgold" />
                  KSP Service History
                </span>
                <p className="text-white font-bold">8+ Years Active Duty</p>
                <p className="text-[10px] text-slate-500 font-semibold">Specialty: Forensic link audit</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/60 p-4 border border-slate-850 rounded-2xl text-[9px] text-slate-550 leading-relaxed font-bold uppercase flex items-start gap-2 border-l-2 border-govgold">
            <FileText className="w-4 h-4 text-govgold shrink-0" />
            <p>
              This terminal tracks session activity. All queries, crime reporting records modifications, and evidence commits are audit-logged for judicial review under Section 65B.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
