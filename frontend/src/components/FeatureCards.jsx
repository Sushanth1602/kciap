import React from 'react'

const features = [
  { title: 'Crime Analytics', desc: 'Insights and trends across the state' },
  { title: 'Crime Mapping', desc: 'Interactive maps and hotspots' },
  { title: 'AI Assistant', desc: 'Natural language insights and summarization' },
  { title: 'Criminal Network Analysis', desc: 'Investigative graph tools' },
  { title: 'Hotspot Detection', desc: 'Cluster-based hotspot detection' },
  { title: 'Predictive Intelligence', desc: 'Model-driven risk forecasting' },
]

export default function FeatureCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {features.map((f) => (
        <div key={f.title} className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="font-semibold">{f.title}</h3>
          <p className="mt-2 text-sm text-slate-600">{f.desc}</p>
        </div>
      ))}
    </div>
  )
}
