import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Landmark, ShieldAlert, Key, Users, BookOpen, Cpu, BarChart2, TrendingUp, Info } from 'lucide-react'

export default function GovernmentLoginPage() {
  const { signIn, signUp, loading, user, toast } = useAuth()
  const navigate = useNavigate()

  const [employeeId, setEmployeeId] = useState('')
  const [department, setDepartment] = useState('Department of Home Affairs')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Redirect if user already authenticated
  useEffect(() => {
    if (user) {
      navigate('/government', { replace: true })
    }
  }, [user, navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!employeeId || !department || !password) {
      toast.error('Complete all executive authentication fields.')
      return
    }

    setSubmitting(true)
    // Map input to official email format for login
    let loginEmail = employeeId
    if (!employeeId.includes('@')) {
      loginEmail = 'government@karnataka.gov.in'
    }

    const { error } = await signIn(loginEmail, password)
    if (error) {
      // Auto-create on first run for developer seeds
      if (loginEmail === 'government@karnataka.gov.in' && password === 'Password123') {
        const { error: signUpError } = await signUp(loginEmail, password, {
          fullName: 'Director S. R. Patil',
          phone: '+91 99000 54321',
          role: 'Government Official'
        })
        if (!signUpError) {
          await signIn(loginEmail, password)
          navigate('/government', { replace: true })
        }
      } else {
        toast.error(error.message || 'Authentication failed. Please verify credentials.')
      }
    } else {
      navigate('/government', { replace: true })
    }
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center p-4 select-none font-semibold">
      <div className="max-w-4xl w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid md:grid-cols-12">
        {/* Left Side: Executive Feature Lists */}
        <div className="md:col-span-5 bg-gradient-to-b from-slate-900 to-govnavy p-8 text-white flex flex-col justify-between text-left">
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-white/10">
              <div className="p-2.5 bg-govblue/10 rounded-xl border border-govblue/20 text-govblue">
                <Landmark className="w-5 h-5 text-govgold" />
              </div>
              <div>
                <span className="text-[10px] text-govgold font-bold uppercase tracking-wider block">EXECUTIVE PORTAL</span>
                <span className="text-xs font-bold text-white uppercase tracking-wide">State Command Center</span>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wide">Command Center Modules</h2>
              <div className="space-y-3.5 text-xs">
                <div className="flex items-start gap-2.5">
                  <BarChart2 className="w-4 h-4 text-govgold shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white uppercase text-[9px] block">Policy Analytics</strong>
                    <span className="text-[10px] text-slate-300 font-semibold leading-relaxed">Assess state crime indicators and YTD conviction stats.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Users className="w-4 h-4 text-govgold shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white uppercase text-[9px] block">District Monitoring</strong>
                    <span className="text-[10px] text-slate-300 font-semibold leading-relaxed">Track regional security ratings and risk metrics.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <TrendingUp className="w-4 h-4 text-govgold shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white uppercase text-[9px] block">Predictive Intelligence</strong>
                    <span className="text-[10px] text-slate-300 font-semibold leading-relaxed">Geospatial crime forecasting for seasonal trends.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Cpu className="w-4 h-4 text-govgold shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white uppercase text-[9px] block">Resource Allocation</strong>
                    <span className="text-[10px] text-slate-300 font-semibold leading-relaxed">Optimize deployment based on statistical spikes.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <BookOpen className="w-4 h-4 text-govgold shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white uppercase text-[9px] block">Executive Reports</strong>
                    <span className="text-[10px] text-slate-300 font-semibold leading-relaxed">Compile consolidated audit briefs.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex items-start gap-2 text-[9px] text-slate-400 uppercase leading-normal">
            <ShieldAlert className="w-4 h-4 text-govgold shrink-0" />
            <p>Classified decision portal. Unauthorized queries logged securely.</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:col-span-7 p-8 flex flex-col justify-between text-left">
          <div>
            <div className="border-b border-slate-200 pb-4 mb-6">
              <h1 className="text-lg font-bold text-govnavy uppercase tracking-wider">Executive Authorization Gate</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">State official portal credentials check</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider">Government Employee ID / Email</label>
                <div className="relative mt-2">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Landmark className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    placeholder="e.g. director.patil@karnataka.gov.in"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 bg-slate-50 rounded-xl text-slate-850 placeholder-slate-400 focus:outline-none focus:border-govblue transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider">Administrative Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-850 focus:outline-none focus:border-govblue transition"
                >
                  <option value="Department of Home Affairs">Department of Home Affairs</option>
                  <option value="State Intelligence Department (SID)">State Intelligence Department (SID)</option>
                  <option value="Department of Information Technology">Department of Information Technology</option>
                  <option value="State Security Audit Board">State Security Audit Board</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider">Security Access Password</label>
                <div className="relative mt-2">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Key className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 bg-slate-50 rounded-xl text-slate-850 placeholder-slate-400 focus:outline-none focus:border-govblue transition"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 border rounded-xl text-[9px] text-govblue font-bold uppercase leading-normal">
                Credentials Tip: Enter ID: "government" and password "Password123" for seed testing.
              </div>

              <button
                type="submit"
                disabled={submitting || loading}
                className="w-full py-2.5 bg-govblue hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition border-b-4 border-slate-950 disabled:opacity-50"
              >
                {submitting || loading ? 'Verifying Desk...' : 'Verify Executive Credentials'}
              </button>
            </form>
          </div>

          <div className="mt-8 text-center border-t border-slate-200 pt-4 text-[10px] text-slate-400">
            Nodal access register:{' '}
            <Link to="/register" className="font-bold text-govblue hover:underline">
              Request Administrative Credentials
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
