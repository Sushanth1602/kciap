import React from 'react'

export default function OfficerPortal() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Officer Dashboard</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border p-4">Assigned Cases</div>
          <div className="rounded-xl border p-4">Open Cases</div>
          <div className="rounded-xl border p-4">High Severity Cases</div>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">FIR Management / Evidence Upload (placeholder)</div>
    </div>
  )
}
