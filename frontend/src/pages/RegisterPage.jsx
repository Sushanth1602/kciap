import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '../hooks/useAuth'
import AuthLayout from '../components/AuthLayout'
import PasswordStrength from '../components/PasswordStrength'
import { User, Mail, Phone, Lock, Eye, EyeOff, Loader2, Chrome, ShieldAlert, CheckCircle2 } from 'lucide-react'

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Full Name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    phone: z
      .string()
      .min(10, 'Phone number must be at least 10 digits')
      .regex(/^[0-9+()\s-]*$/, 'Invalid phone number format'),
    role: z.enum(['Citizen', 'Police Officer', 'Government Official'], {
      errorMap: () => ({ message: 'Please select an access role' }),
    }),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export default function RegisterPage() {
  const { signUp, signInWithGoogle, loading, toast } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState(null)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      role: 'Citizen',
      password: '',
      confirmPassword: '',
    },
  })

  const watchPassword = watch('password')

  const onSubmit = async (values) => {
    const { data, error } = await signUp(values.email, values.password, {
      fullName: values.fullName,
      phone: values.phone,
      role: values.role,
    })

    if (!error) {
      toast.success('Registration request submitted.')
      // Redirect to verification screen
      setRegisteredEmail(values.email)
    }
  }

  // Verification Screen
  if (registeredEmail) {
    return (
      <AuthLayout
        title="Verification Required"
        subtitle="Confirm your identity to activate account access"
      >
        <div className="space-y-6 text-center py-6">
          <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-blue-950/50 border border-blue-500/30 text-blue-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-100">Verification Email Sent</h3>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
              We have sent a verification link to <span className="text-slate-200 font-medium">{registeredEmail}</span>. Please click the link to verify your email and activate your account.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex items-start gap-3 text-left max-w-md mx-auto">
            <ShieldAlert className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-400 leading-normal">
              Notice: Law enforcement profiles ('Police Officer' and 'Government Official') require administrative review in addition to email verification before system access is granted.
            </p>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <Link
              to="/login"
              className="py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg text-center"
            >
              Return to Sign In
            </Link>
          </div>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Register your credentials for database access"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        {/* Full Name */}
        <div className="space-y-1">
          <label htmlFor="fullName" className="text-xs font-semibold text-slate-300 tracking-wide block">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <User className="w-4 h-4" />
            </div>
            <input
              id="fullName"
              placeholder="Sushanth Gowda"
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                errors.fullName
                  ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/50'
                  : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500/50'
              }`}
              {...register('fullName')}
            />
          </div>
          {errors.fullName && (
            <p className="text-[11px] text-rose-400 font-medium">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label htmlFor="email" className="text-xs font-semibold text-slate-300 tracking-wide block">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="email"
              type="email"
              placeholder="name@ksp.gov.in"
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
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

        {/* Phone */}
        <div className="space-y-1">
          <label htmlFor="phone" className="text-xs font-semibold text-slate-300 tracking-wide block">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Phone className="w-4 h-4" />
            </div>
            <input
              id="phone"
              placeholder="+91 9876543210"
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                errors.phone
                  ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/50'
                  : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500/50'
              }`}
              {...register('phone')}
            />
          </div>
          {errors.phone && (
            <p className="text-[11px] text-rose-400 font-medium">{errors.phone.message}</p>
          )}
        </div>

        {/* Role Selection Dropdown */}
        <div className="space-y-1">
          <label htmlFor="role" className="text-xs font-semibold text-slate-300 tracking-wide block">
            System Access Level (Role)
          </label>
          <select
            id="role"
            className="w-full px-3.5 py-2.5 bg-slate-900/60 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
            {...register('role')}
          >
            <option value="Citizen" className="bg-slate-950 text-slate-200">Citizen Portal</option>
            <option value="Police Officer" className="bg-slate-950 text-slate-200">Police Officer</option>
            <option value="Government Official" className="bg-slate-950 text-slate-200">Government Official</option>
          </select>
          {errors.role && (
            <p className="text-[11px] text-rose-400 font-medium">{errors.role.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label htmlFor="password" className="text-xs font-semibold text-slate-300 tracking-wide block">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className={`w-full pl-10 pr-10 py-2.5 bg-slate-900/60 border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                errors.password
                  ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/50'
                  : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500/50'
              }`}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[11px] text-rose-400 font-medium">{errors.password.message}</p>
          )}

          {/* Password strength indicator component */}
          <PasswordStrength password={watchPassword} />
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <label htmlFor="confirmPassword" className="text-xs font-semibold text-slate-300 tracking-wide block">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className={`w-full pl-10 pr-10 py-2.5 bg-slate-900/60 border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                errors.confirmPassword
                  ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/50'
                  : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500/50'
              }`}
              {...register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-[11px] text-rose-400 font-medium">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Register Actions */}
        <div className="space-y-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg hover:shadow-blue-500/10 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Registering...
              </>
            ) : (
              'Create Account'
            )}
          </button>

          {/* Google Auth Option */}
          <button
            type="button"
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-slate-200 text-sm font-semibold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-slate-800"
          >
            <Chrome className="w-4 h-4 text-blue-400" />
            Continue with Google
          </button>
        </div>
      </form>

      {/* Footer link */}
      <div className="mt-6 text-center">
        <p className="text-xs text-slate-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
