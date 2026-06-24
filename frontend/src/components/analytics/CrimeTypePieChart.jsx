import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const COLORS = [
  '#0F172A', // Slate 900
  '#1E40AF', // Blue 800 (Gov Blue)
  '#5B21B6', // Purple 800 (Gov Purple)
  '#991B1B', // Red 800
  '#065F46', // Emerald 800
  '#92400E', // Amber 800
  '#374151', // Gray 700
  '#0369A1', // Sky 700
  '#B45309', // Amber 700
  '#075985', // Sky 800
]

function CrimeTypePieChart({ data }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie 
            data={data} 
            dataKey="count" 
            nameKey="crime_type" 
            outerRadius={88} 
            fill="#1E40AF" 
            labelLine={false}
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${entry.crime_type}-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
          <Legend verticalAlign="bottom" height={42} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CrimeTypePieChart
