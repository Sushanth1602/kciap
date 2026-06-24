import React from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { Shield, Landmark, Users, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const navigate = useNavigate()

  return (
    <AuthLayout
      title="Platform Gateway Selection"
      subtitle="Identify your access clearance to navigate to the appropriate portal login"
    >
      <div className="space-y-4 text-left">
        {/* Citizen Gateway */}
        <div 
          onClick={() => navigate('/login/citizen')}
          className="p-4 bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 rounded-2xl cursor-pointer transition flex items-center gap-4 group"
        >
          <div className="p-3 bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 rounded-xl transition">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-wider">Citizen Services Portal</h3>
            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed mt-0.5">
              Public access gate to file and track complaints and view safety maps.
            </p>
          </div>
        </div>

        {/* Police Gateway */}
        <div 
          onClick={() => navigate('/login/officer')}
          className="p-4 bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800 hover:border-govgold/50 rounded-2xl cursor-pointer transition flex items-center gap-4 group"
        >
          <div className="p-3 bg-govgold/10 text-govgold group-hover:bg-govgold/20 rounded-xl transition">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-wider">Police Operations Center</h3>
            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed mt-0.5">
              Restricted desk for duty inspectors. FIR filing and link analysis.
            </p>
          </div>
        </div>

        {/* Government Gateway */}
        <div 
          onClick={() => navigate('/login/government')}
          className="p-4 bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800 hover:border-govblue/50 rounded-2xl cursor-pointer transition flex items-center gap-4 group"
        >
          <div className="p-3 bg-govblue/10 text-govblue group-hover:bg-govblue/20 rounded-xl transition">
            <Landmark className="w-6 h-6 text-govblue" />
          </div>
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-wider">State Crime Command Center</h3>
            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed mt-0.5">
              Restricted portal for director planning. Policy & force deployment analytics.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-full mt-6 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Public Homepage
        </button>
      </div>
    </AuthLayout>
  )
}
