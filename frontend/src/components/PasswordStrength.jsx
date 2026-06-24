import React from 'react'
import { Check, X } from 'lucide-react'

export default function PasswordStrength({ password = '' }) {
  const criteria = [
    { label: 'Minimum 8 characters', rule: (p) => p.length >= 8 },
    { label: 'At least one number', rule: (p) => /[0-9]/.test(p) },
    { label: 'Uppercase & Lowercase', rule: (p) => /[A-Z]/.test(p) && /[a-z]/.test(p) },
    { label: 'Special character (!@#$%)', rule: (p) => /[^A-Za-z0-9]/.test(p) },
  ]

  const passedCount = criteria.filter((c) => c.rule(password)).length

  // Calculate score and formatting
  let strengthLabel = 'Too Weak'
  let colorClass = 'bg-rose-500'
  let textClass = 'text-rose-400'
  let widthClass = 'w-1/4'

  if (passedCount === 2) {
    strengthLabel = 'Weak'
    colorClass = 'bg-orange-500'
    textClass = 'text-orange-400'
    widthClass = 'w-2/4'
  } else if (passedCount === 3) {
    strengthLabel = 'Medium'
    colorClass = 'bg-yellow-500'
    textClass = 'text-yellow-400'
    widthClass = 'w-3/4'
  } else if (passedCount === 4) {
    strengthLabel = 'Strong'
    colorClass = 'bg-emerald-500'
    textClass = 'text-emerald-400'
    widthClass = 'w-full'
  }

  if (!password) {
    return null
  }

  return (
    <div className="space-y-3 pt-2">
      {/* Strength indicator bar */}
      <div className="space-y-1">
        <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider">
          <span className="text-slate-400">Password Strength:</span>
          <span className={textClass}>{strengthLabel}</span>
        </div>
        <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
          <div className={`h-full transition-all duration-500 rounded-full ${colorClass} ${widthClass}`} />
        </div>
      </div>

      {/* Criteria Checklist */}
      <div className="grid grid-cols-2 gap-2 text-[10px]">
        {criteria.map((c, idx) => {
          const isPassed = c.rule(password)
          return (
            <div key={idx} className="flex items-center gap-1.5 text-slate-400">
              {isPassed ? (
                <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              ) : (
                <div className="w-3.5 h-3.5 rounded-full border border-slate-700 flex items-center justify-center flex-shrink-0">
                  <X className="w-2.5 h-2.5 text-slate-600" />
                </div>
              )}
              <span className={isPassed ? 'text-slate-300' : 'text-slate-500'}>
                {c.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
