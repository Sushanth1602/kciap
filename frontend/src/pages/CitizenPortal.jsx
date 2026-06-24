import React from 'react'

export default function CitizenPortal() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Citizen Portal</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border p-4">Report Crime</div>
          <div className="rounded-xl border p-4">Track Complaint</div>
          <div className="rounded-xl border p-4">Safety Alerts</div>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">Missing Persons Section (placeholder)</div>
    </div>
  )
}
