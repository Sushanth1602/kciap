import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Shield, ShieldAlert, Key, FileText, Network, Landmark, Camera, AlertCircle, Bot } from 'lucide-react'

export default function OfficerLoginPage() {
  const { signIn, signUp, loading, user, toast } = useAuth()
  const navigate = useNavigate()

  const [officerId, setOfficerId] = useState('')
  const [badgeNumber, setBadgeNumber] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Redirect if user already authenticated
  useEffect(() => {
    if (user) {
      navigate('/officer', { replace: true })
    }
  }, [user, navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!officerId || !badgeNumber || !password) {
      toast.error('Complete all security authentication fields.')
      return
    }

    setSubmitting(true)
    // Map input to official email format for login
    let loginEmail = officerId
    if (!officerId.includes('@')) {
      loginEmail = 'officer@karnataka.gov.in'
    }

    const { error } = await signIn(loginEmail, password)
    if (error) {
      // Auto-create on first run for developer seeds
      if (loginEmail === 'officer@karnataka.gov.in' && password === 'Password123') {
        const { error: signUpError } = await signUp(loginEmail, password, {
          fullName: 'Inspector K. S. Gowda',
          phone: `+91 98450 ${badgeNumber}`,
          role: 'Police Officer'
        })
        if (!signUpError) {
          await signIn(loginEmail, password)
          navigate('/officer', { replace: true })
        }
      } else {
        toast.error(error.message || 'Authentication failed. Please verify credentials.')
      }
    } else {
      navigate('/officer', { replace: true })
    }
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-[#070D19] text-slate-350 flex items-center justify-center p-4 select-none font-semibold">
      <div className="max-w-4xl w-full bg-[#0B1220] rounded-3xl border border-slate-900 shadow-2xl overflow-hidden grid md:grid-cols-12">
        {/* Left Side: Law Enforcement Feature Lists */}
        <div className="md:col-span-5 bg-gradient-to-b from-[#09152B] to-[#040C1A] p-8 border-r border-slate-900 flex flex-col justify-between text-left">
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-900">
              <div className="p-2.5 bg-govgold/10 rounded-xl border border-govgold/20 text-govgold">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-govgold font-bold uppercase tracking-wider block">RESTRICTED DESK</span>
                <span className="text-xs font-bold text-white uppercase tracking-wide">KSP Operations Portal</span>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white uppercase tracking-wide">Operational Tools Directory</h2>
              <div className="space-y-3.5 text-xs">
                <div className="flex items-start gap-2.5">
                  <FileText className="w-4 h-4 text-govgold shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-200 uppercase text-[9px] block">FIR Management</strong>
                    <span className="text-[10px] text-slate-400 font-semibold leading-relaxed">Register, check, and commit crime reports files.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Network className="w-4 h-4 text-govgold shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-200 uppercase text-[9px] block">Criminal Intelligence</strong>
                    <span className="text-[10px] text-slate-400 font-semibold leading-relaxed">Suspect relationship linkage analysis graphs.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Camera className="w-4 h-4 text-govgold shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-200 uppercase text-[9px] block">Evidence Tracking</strong>
                    <span className="text-[10px] text-slate-400 font-semibold leading-relaxed">Witness statements, footage & file linkages.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Landmark className="w-4 h-4 text-govgold shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-200 uppercase text-[9px] block">Hotspot Analysis</strong>
                    <span className="text-[10px] text-slate-400 font-semibold leading-relaxed">Geospatial crime clustering density overlays.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Bot className="w-4 h-4 text-govgold shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-200 uppercase text-[9px] block">AI Investigator</strong>
                    <span className="text-[10px] text-slate-400 font-semibold leading-relaxed">Secure digital investigator prompt assistant.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-900 flex items-start gap-2.5 text-[9px] text-slate-500 uppercase leading-normal">
            <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
            <p>Authorized police logins only. Transactions are audited under Section 65B IT Act.</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:col-span-7 p-8 flex flex-col justify-between text-left">
          <div>
            <div className="border-b border-slate-900 pb-4 mb-6">
              <h1 className="text-lg font-bold text-white uppercase tracking-wider">Officer Verification Gate</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">Provide credential badge parameters</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Officer ID / Email</label>
                <div className="relative mt-2">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-600">
                    <Shield className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={officerId}
                    onChange={(e) => setOfficerId(e.target.value)}
                    placeholder="e.g. officer@ksp.gov.in"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-800 bg-slate-950 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-govgold transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">KSP Badge Number</label>
                <div className="relative mt-2">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-600">
                    <Key className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={badgeNumber}
                    onChange={(e) => setBadgeNumber(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="Enter 4-digit badge number"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-800 bg-slate-950 rounded-xl text-white font-mono placeholder:font-sans placeholder-slate-600 focus:outline-none focus:border-govgold transition text-left font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Platform Security Password</label>
                <div className="relative mt-2">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-600">
                    <Key className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-800 bg-slate-950 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-govgold transition"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-850 rounded-xl text-[9px] text-govgold font-bold uppercase leading-normal">
                Credentials Tip: Enter ID: "officer" and Badge: "8902" with password "Password123" for seed testing.
              </div>

              <button
                type="submit"
                disabled={submitting || loading}
                className="w-full py-2.5 bg-govgold hover:bg-yellow-500 text-govnavy rounded-xl text-xs font-bold uppercase tracking-wider transition border-b-4 border-yellow-750 disabled:opacity-50"
              >
                {submitting || loading ? 'Decrypting Gate...' : 'Verify Officer Credentials'}
              </button>
            </form>
          </div>

          <div className="mt-8 text-center border-t border-slate-900 pt-4 text-[10px] text-slate-500">
            KSP registration desk:{' '}
            <Link to="/register" className="font-bold text-govgold hover:underline">
              Submit New Badge Request
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
