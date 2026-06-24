import React, { useEffect, useState } from 'react'
import KpiCard from './KpiCard'
import { Shield, CheckCircle, AlertTriangle, BookOpen } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export default function StatsCards() {
  const [summary, setSummary] = useState({ total_crimes: 0, active_cases: 0, closed_cases: 0, high_severity_cases: 0 })

  useEffect(() => {
    fetch(`${API_BASE}/analytics/summary`)
      .then((r) => r.json())
      .then(setSummary)
      .catch(console.error)
  }, [])

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard 
        title="Total Crimes" 
        value={summary.total_crimes.toLocaleString()} 
        subtitle="Consolidated incidents"
        icon={<Shield className="w-5 h-5 text-blue-600" />}
      />
      <KpiCard 
        title="Active Cases" 
        value={summary.active_cases.toLocaleString()} 
        subtitle="Under ongoing investigation"
        icon={<AlertTriangle className="w-5 h-5 text-orange-500" />}
      />
      <KpiCard 
        title="Closed Cases" 
        value={summary.closed_cases.toLocaleString()} 
        subtitle="Resolved and archived"
        icon={<CheckCircle className="w-5 h-5 text-green-600" />}
      />
      <KpiCard 
        title="High Severity Cases" 
        value={summary.high_severity_cases.toLocaleString()} 
        subtitle="Level 4 and 5 priority"
        icon={<BookOpen className="w-5 h-5 text-red-600" />}
      />
    </div>
  )
}
