import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '../hooks/useAuth'
import AuthLayout from '../components/AuthLayout'
import { Mail, Loader2, ArrowLeft, Send } from 'lucide-react'

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
})

export default function ForgotPasswordPage() {
  const { resetPassword, loading, toast } = useAuth()
  const [isSent, setIsSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (values) => {
    const { error } = await resetPassword(values.email)
    if (!error) {
      setIsSent(true)
      toast.success('Reset email sent.')
    }
  }

  return (
    <AuthLayout
      title="Recover Access"
      subtitle="Request a secure password reset link for your account"
    >
      {isSent ? (
        <div className="space-y-6 text-center py-4">
          <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-blue-950/50 border border-blue-500/30 text-blue-400">
            <Send className="w-5 h-5 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-slate-100">Recovery Email Sent</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
              Please check your inbox. If the email is registered in our database, you will receive instructions to safely configure a new password.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to Login Portal
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-semibold text-slate-300 tracking-wide block">
              Enter Registered Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="email"
                type="email"
                placeholder="officer@ksp.gov.in"
                className={`w-full pl-10 pr-4 py-3 bg-slate-900/60 border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                  errors.email
                    ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/50'
                    : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500/50'
                }`}
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-rose-400 font-medium">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg hover:shadow-blue-500/10 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Link...
                </>
              ) : (
                'Send Recovery Link'
              )}
            </button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Sign In
              </Link>
            </div>
          </div>
        </form>
      )}
    </AuthLayout>
  )
}
