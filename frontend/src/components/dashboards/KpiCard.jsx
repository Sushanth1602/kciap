import React from 'react'

function KpiCard({ title, value, subtitle, icon, trend }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 relative overflow-hidden flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
        </div>
        {icon && (
          <div className="p-3 bg-slate-50 rounded-xl text-slate-600 border border-slate-100">
            {icon}
          </div>
        )}
      </div>
      {(subtitle || trend) && (
        <div className="mt-4 flex items-center gap-2 text-xs">
          {trend && (
            <span className={`font-semibold ${trend.startsWith('↑') ? 'text-red-600' : 'text-green-600'}`}>
              {trend}
            </span>
          )}
          {subtitle && <span className="text-slate-500 font-medium">{subtitle}</span>}
        </div>
      )}
    </div>
  )
}

export default KpiCard
