import React from 'react'
import RoleSelector from '../components/RoleSelector'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-xl p-6">
      <h2 className="mb-4 text-2xl font-semibold">Login (Mock)</h2>
      <p className="mb-4 text-sm text-slate-600">Select your role to continue.</p>
      <RoleSelector onSelect={(role) => {
        if (role === 'Citizen') navigate('/citizen')
        else if (role === 'Police Officer') navigate('/officer')
        else navigate('/government')
      }} />
    </div>
  )
}
