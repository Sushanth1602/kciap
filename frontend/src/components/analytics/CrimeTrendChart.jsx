import React from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

function CrimeTrendChart({ data }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1E40AF" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#1E40AF" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
          <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <Area type="monotone" dataKey="count" stroke="#1E40AF" strokeWidth={2} fill="url(#trendGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CrimeTrendChart
