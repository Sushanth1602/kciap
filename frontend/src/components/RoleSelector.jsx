import React from 'react'

const roles = ['Citizen', 'Police Officer', 'Senior Officer', 'Government Official']

export default function RoleSelector({ onSelect }) {
  return (
    <div className="grid gap-3">
      {roles.map((r) => (
        <button key={r} onClick={() => onSelect(r)} className="rounded-lg border px-4 py-3 text-left hover:bg-slate-50">
          <div className="font-semibold">{r}</div>
          <div className="text-sm text-slate-500">Continue as {r}</div>
        </button>
      ))}
    </div>
  )
}
