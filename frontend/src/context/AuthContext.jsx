import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({
  user: null,
  session: null,
  profile: null,
  loading: true,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  signInWithGoogle: async () => {},
  toast: {
    success: () => {},
    error: () => {},
    info: () => {},
  },
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toasts, setToasts] = useState([])

  // Toast notification handlers
  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }

  const toast = {
    success: (msg) => showToast(msg, 'success'),
    error: (msg) => showToast(msg, 'error'),
    info: (msg) => showToast(msg, 'info'),
  }

  // Fetch profile details from database
  // Fetch profile details from database with defensive fallback creation
  const fetchProfile = async (userId, currentUser) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        console.error('Error fetching profile from Supabase profiles table:', error)
        throw error
      }

      // Defensive auto-creation: If profile doesn't exist but user is logged in, create it on-the-fly
      if (!data && currentUser) {
        console.log('Profile row not found for active user, attempting to auto-create...')
        const fullName = currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Authenticated User'
        const role = currentUser.user_metadata?.role || 'Citizen'
        const phone = currentUser.user_metadata?.phone || ''

        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([
            {
              id: userId,
              full_name: fullName,
              email: currentUser.email,
              phone: phone,
              role: role,
            },
          ])
          .select()
          .maybeSingle()

        if (insertError) {
          console.error('Failed to create user profile defensively:', insertError.message)
          return null
        }
        return newProfile
      }

      return data
    } catch (err) {
      console.error('Error fetching user profile:', err.message)
      return null
    }
  }

  useEffect(() => {
    // Check active sessions and sets user
    const initializeAuth = async () => {
      try {
        const { data: { session: activeSession } } = await supabase.auth.getSession()
        setSession(activeSession)
        
        if (activeSession) {
          setUser(activeSession.user)
          const userProfile = await fetchProfile(activeSession.user.id, activeSession.user)
          setProfile(userProfile)
        }
      } catch (err) {
        console.error('Error initializing auth session:', err.message)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth state changes with try-catch-finally wrapper
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      try {
        setSession(currentSession)
        setUser(currentSession?.user ?? null)
        
        if (currentSession?.user) {
          const userProfile = await fetchProfile(currentSession.user.id, currentSession.user)
          setProfile(userProfile)
        } else {
          setProfile(null)
        }
      } catch (err) {
        console.error('Error in onAuthStateChange profile retrieval:', err.message)
      } finally {
        setLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Sign Up logic
  const signUp = async (email, password, metadata) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: metadata.fullName,
            phone: metadata.phone,
            role: metadata.role,
          },
        },
      })

      if (error) throw error

      // Client-side profile insert: Error must be handled and thrown if insert fails
      if (data?.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              full_name: metadata.fullName,
              email: email,
              phone: metadata.phone,
              role: metadata.role,
            },
          ])
        
        if (profileError) {
          throw new Error(`Profile database creation failed: ${profileError.message}`)
        }
      }
      
      return { data, error: null }
    } catch (err) {
      toast.error(err.message)
      return { data: null, error: err }
    } finally {
      setLoading(false)
    }
  }

  // Sign In logic
  const signIn = async (email, password) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast.success('Logged in successfully.')
      return { data, error: null }
    } catch (err) {
      toast.error(err.message)
      return { data: null, error: err }
    } finally {
      setLoading(false)
    }
  }

  // Sign Out logic
  const signOut = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      toast.success('Logged out successfully.')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Reset Password Request
  const resetPassword = async (email) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      })
      if (error) throw error
      toast.success('Password reset link sent to your email.')
      return { error: null }
    } catch (err) {
      toast.error(err.message)
      return { error: err }
    } finally {
      setLoading(false)
    }
  }

  // OAuth Google Log-In
  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      })
      if (error) throw error
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        resetPassword,
        signInWithGoogle,
        toast,
      }}
    >
      {children}

      {/* Floating Toast Notification UI container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center justify-between rounded-xl px-4 py-3 shadow-lg transition-all duration-300 transform translate-y-0 animate-fade-in-up border text-white backdrop-blur-md ${
              t.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/30'
                : t.type === 'error'
                ? 'bg-rose-950/90 border-rose-500/30'
                : 'bg-blue-950/90 border-blue-500/30'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">{t.message}</span>
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
              className="ml-4 text-xs font-semibold text-white/50 hover:text-white"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
