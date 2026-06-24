import React from 'react'
import { Shield, Lock, Eye, CheckCircle } from 'lucide-react'

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#0B1220] px-4 py-12 md:py-20 overflow-hidden text-slate-100">
      
      {/* Styles for animated backgrounds */}
      <style>{`
        @keyframes grid-move {
          0% { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }
        @keyframes radial-pulse {
          0% { transform: scale(1); opacity: 0.15; }
          50% { transform: scale(1.1); opacity: 0.25; }
          100% { transform: scale(1); opacity: 0.15; }
        }
        .animated-grid {
          background-image: 
            linear-gradient(to right, rgba(59, 130, 246, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(59, 130, 246, 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: grid-move 10s linear infinite;
        }
        .glow-sphere-1 {
          animation: radial-pulse 8s ease-in-out infinite;
        }
        .glow-sphere-2 {
          animation: radial-pulse 12s ease-in-out infinite;
        }
      `}</style>

      {/* Decorative Glow Spheres */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none glow-sphere-1" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[130px] pointer-events-none glow-sphere-2" />

      {/* Animated Grid Overlay */}
      <div className="absolute inset-0 animated-grid opacity-80 pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-4xl grid md:grid-cols-5 bg-slate-950/40 border border-slate-800/60 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl">
        
        {/* Left Panel: Branding & Security Info (Visible on Md and Up) */}
        <div className="hidden md:flex md:col-span-2 flex-col justify-between p-8 bg-slate-950/65 border-r border-slate-800/40 relative">
          
          {/* Logo & Header */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                  KCIAP
                </h1>
                <p className="text-[10px] tracking-wider text-slate-500 font-semibold uppercase">
                  Govt of Karnataka
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <h2 className="text-lg font-semibold text-slate-200">
                Crime Intelligence & Analytical Platform
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Integrating security databases, threat intelligence, and predictive analytics for real-time law enforcement coordination.
              </p>
            </div>
          </div>

          {/* Core Features list */}
          <div className="space-y-4 my-8">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-slate-300">Advanced suspect and network link mapping</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-slate-300">Automated precinct heat maps & hotspots</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-slate-300">Role-based data access encryption</p>
            </div>
          </div>

          {/* Secure gateway notice */}
          <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-900/30 flex items-start gap-3">
            <Lock className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[10px] font-bold tracking-wider text-blue-400 uppercase">
                Secure Gateway
              </p>
              <p className="text-[10px] text-slate-400 leading-normal">
                Authorized law enforcement and verified citizens access only. Sessions are logged.
              </p>
            </div>
          </div>

        </div>

        {/* Right Panel: Content Card */}
        <div className="col-span-5 md:col-span-3 flex flex-col justify-center p-8 md:p-12">
          
          {/* Logo representation for Mobile */}
          <div className="md:hidden flex items-center justify-center gap-3 mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <span className="text-lg font-bold tracking-tight text-white block">
                KCIAP
              </span>
              <span className="text-[8px] tracking-widest text-slate-500 uppercase block font-semibold">
                Karnataka State Police
              </span>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-100 mb-1">
              {title}
            </h2>
            <p className="text-sm text-slate-400">
              {subtitle}
            </p>
          </div>

          {/* Form Content */}
          {children}

        </div>

      </div>

    </div>
  )
}
