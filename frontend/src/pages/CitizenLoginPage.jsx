import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Shield, Mail, Lock, Phone, Chrome, ChevronRight, AlertCircle, Info, CheckCircle } from 'lucide-react'

export default function CitizenLoginPage() {
  const { signIn, signUp, signInWithGoogle, loading, user, toast } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Tabs: 'otp' | 'email'
  const [activeTab, setActiveTab] = useState('otp')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [generatedOtp, setGeneratedOtp] = useState('')
  const [enteredOtp, setEnteredOtp] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otpLoading, setOtpLoading] = useState(false)

  // Redirect if user already authenticated
  useEffect(() => {
    if (user) {
      navigate('/citizen', { replace: true })
    }
  }, [user, navigate])

  const handleSendOtp = (e) => {
    e.preventDefault()
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number.')
      return
    }

    setOtpLoading(true)
    setTimeout(() => {
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      setGeneratedOtp(code)
      setOtpSent(true)
      setOtpLoading(false)
      // Display simulated OTP message
      alert(`[KSP-OTP] Your Mobile OTP verification code is: ${code}`)
      toast.info('Simulated verification SMS sent to your phone.')
    }, 1200)
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (enteredOtp !== generatedOtp) {
      toast.error('Invalid OTP. Please enter the simulated verification code.')
      return
    }

    setOtpLoading(true)
    // Authenticate defensively under guest citizen account
    const guestEmail = 'guest-citizen@karnataka.gov.in'
    const guestPass = 'Password123'

    const { error } = await signIn(guestEmail, guestPass)
    if (error) {
      // Auto-register guest if not exists
      const { error: signUpError } = await signUp(guestEmail, guestPass, {
        fullName: 'Citizen (Guest)',
        phone: phoneNumber,
        role: 'Citizen',
      })
      if (!signUpError) {
        await signIn(guestEmail, guestPass)
        navigate('/citizen', { replace: true })
      }
    } else {
      navigate('/citizen', { replace: true })
    }
    setOtpLoading(false)
  }

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please complete all login fields.')
      return
    }

    const { error } = await signIn(email, password)
    if (!error) {
      navigate('/citizen', { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center p-4 select-none font-semibold">
      <div className="max-w-4xl w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid md:grid-cols-12">
        {/* Left Side: Services Info Panel */}
        <div className="md:col-span-5 bg-gradient-to-br from-blue-700 to-indigo-800 p-8 text-white flex flex-col justify-between text-left">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="p-2.5 bg-white/10 rounded-xl border border-white/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-[10px] text-blue-200 font-bold uppercase tracking-wider block">State of Karnataka</span>
                <span className="text-xs font-bold uppercase tracking-wide">Public Safety Portal</span>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h2 className="text-xl font-bold tracking-tight leading-snug">File and Track Complaints Digitally</h2>
              <p className="text-xs text-blue-100 font-semibold leading-relaxed">
                KSP provides immediate secure access to civil safety tools. Register crime incidents, attach media evidence, and monitor investigation logs.
              </p>
            </div>

            <div className="space-y-3.5 pt-4 text-xs font-semibold">
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-blue-300 shrink-0 mt-0.5" />
                <p className="text-blue-50">Automatic SMS alerts with unique Complaint IDs.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-blue-300 shrink-0 mt-0.5" />
                <p className="text-blue-50">Secure 112 emergency routing protocols.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-blue-300 shrink-0 mt-0.5" />
                <p className="text-blue-50">State safety hotspot overview metrics maps.</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex items-center gap-2 text-[10px] text-blue-200 font-bold uppercase">
            <Info className="w-3.5 h-3.5" />
            <span>Official KSP Civic Hub</span>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:col-span-7 p-8 flex flex-col justify-between text-left">
          <div>
            <div className="border-b border-slate-100 pb-4 mb-6">
              <h1 className="text-lg font-bold text-govnavy uppercase tracking-wider">Citizen Account Portal</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">Authenticate to access public safety desks</p>
            </div>

            {/* Tab Selectors */}
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl mb-6 text-xs">
              <button
                type="button"
                onClick={() => { setActiveTab('otp'); setOtpSent(false); }}
                className={`py-2 rounded-lg font-bold uppercase tracking-wider transition ${
                  activeTab === 'otp' ? 'bg-white text-blue-750 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Mobile OTP
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('email')}
                className={`py-2 rounded-lg font-bold uppercase tracking-wider transition ${
                  activeTab === 'email' ? 'bg-white text-blue-750 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Password Sign In
              </button>
            </div>

            {/* Form Workspace */}
            {activeTab === 'otp' ? (
              <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4 text-xs font-semibold">
                {!otpSent ? (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider">Mobile Phone Number</label>
                    <div className="relative mt-2">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="Enter 10-digit mobile number"
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 bg-slate-50 rounded-xl text-slate-850 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider">Verification OTP Code</label>
                    <div className="relative mt-2">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="Enter 6-digit OTP code"
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 bg-slate-50 rounded-xl text-slate-850 font-mono tracking-widest placeholder:tracking-normal placeholder-slate-400 focus:outline-none focus:border-blue-500 transition text-center text-sm font-bold"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="mt-2 text-[10px] text-blue-600 hover:underline block"
                    >
                      Change phone number
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={otpLoading || loading}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition border-b-4 border-blue-800 disabled:opacity-50"
                >
                  {otpLoading || loading ? 'Processing...' : otpSent ? 'Verify & Sign In' : 'Request OTP Code'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleEmailLogin} className="space-y-4 text-xs font-semibold">
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider">Account Email</label>
                  <div className="relative mt-2">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="citizen@karnataka.gov.in"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 bg-slate-50 rounded-xl text-slate-850 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider">Password</label>
                  <div className="relative mt-2">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 bg-slate-50 rounded-xl text-slate-850 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition border-b-4 border-blue-800 disabled:opacity-50"
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                </button>
              </form>
            )}

            {/* Divider */}
            <div className="relative flex items-center justify-center py-4">
              <div className="absolute w-full border-t border-slate-200"></div>
              <span className="relative z-10 px-3 bg-white text-[9px] uppercase font-bold tracking-widest text-slate-400">
                Or Connect Via
              </span>
            </div>

            {/* Google Authentication */}
            <button
              type="button"
              onClick={signInWithGoogle}
              className="w-full flex items-center justify-center gap-2 py-2.5 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-700 text-xs font-bold uppercase transition"
            >
              <Chrome className="w-4 h-4 text-blue-500" />
              Sign in with Google
            </button>
          </div>

          <div className="mt-8 text-center border-t border-slate-100 pt-4 text-[10px] text-slate-400">
            Need public access credentials?{' '}
            <Link to="/register" className="font-bold text-blue-600 hover:underline">
              Create Citizen Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
