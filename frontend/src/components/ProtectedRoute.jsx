import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ShieldAlert, Loader2 } from 'lucide-react'

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, profile, loading, signOut } = useAuth()
  const location = useLocation()

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0B1220] text-slate-300">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
        <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase">
          Verifying Security Credentials...
        </p>
      </div>
    )
  }

  // 2. Unauthenticated State
  if (!user) {
    let loginRoute = '/login'
    if (location.pathname.startsWith('/citizen')) loginRoute = '/login/citizen'
    else if (location.pathname.startsWith('/officer')) loginRoute = '/login/officer'
    else if (location.pathname.startsWith('/government')) loginRoute = '/login/government'
    
    return <Navigate to={loginRoute} state={{ from: location }} replace />
  }

  // 3. Wait for profile / Defensive check: If user is authenticated but profile database row was not found
  if (!profile) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0B1220] px-4 py-8 text-slate-300">
        <div className="max-w-md w-full p-8 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-md text-center space-y-5">
          <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-rose-950/50 border border-rose-500/30 text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-slate-100">No Profile Found</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your account is authenticated, but no database security profile was found. Please contact an administrator or register again.
            </p>
          </div>
          <button
            onClick={() => signOut()}
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-xl transition"
          >
            Sign Out & Return
          </button>
        </div>
      </div>
    )
  }

  // 4. Role Authorization Check
  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    // If user's role is not authorized for this specific portal, redirect to their own portal
    let fallbackRoute = '/login'
    if (profile.role === 'Citizen') fallbackRoute = '/citizen'
    else if (profile.role === 'Police Officer') fallbackRoute = '/officer'
    else if (profile.role === 'Government Official') fallbackRoute = '/government'

    return <Navigate to={fallbackRoute} replace />
  }

  // 5. Generic /dashboard routing fallback
  // If the user navigates directly to "/dashboard", redirect them to their specific role dashboard
  if (location.pathname === '/dashboard') {
    let dashboardRoute = '/login'
    if (profile.role === 'Citizen') dashboardRoute = '/citizen'
    else if (profile.role === 'Police Officer') dashboardRoute = '/officer'
    else if (profile.role === 'Government Official') dashboardRoute = '/government'

    return <Navigate to={dashboardRoute} replace />
  }

  // 6. Authorized
  return children
}
