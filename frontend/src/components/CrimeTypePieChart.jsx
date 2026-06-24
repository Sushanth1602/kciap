import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const COLORS = ['#2563eb', '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6', '#22c55e', '#e11d48', '#0ea5e9', '#64748b', '#f97316']

function CrimeTypePieChart({ data }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="count" nameKey="crime_type" outerRadius={98} fill="#2563eb" label />
          {data.map((entry, index) => (
            <Cell key={`cell-${entry.crime_type}-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CrimeTypePieChart
