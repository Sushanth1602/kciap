import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Navbar() {
  const [dark, setDark] = useState(false)
  const navigate = useNavigate()

  return (
    <header className="border-b bg-white/95 dark:bg-slate-900/95 p-4 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="text-deepblue text-xl font-semibold">KCIAP</div>
          <nav className="hidden gap-2 md:flex">
            <Link to="/" className="px-3 py-2 text-sm hover:bg-slate-100 rounded">Home</Link>
            <Link to="/citizen" className="px-3 py-2 text-sm hover:bg-slate-100 rounded">Citizen Portal</Link>
            <Link to="/officer" className="px-3 py-2 text-sm hover:bg-slate-100 rounded">Officer Portal</Link>
            <Link to="/government" className="px-3 py-2 text-sm hover:bg-slate-100 rounded">Government Dashboard</Link>
            <Link to="/dashboard" className="px-3 py-2 text-sm hover:bg-slate-100 rounded">Analytics</Link>
            <Link to="/ai" className="px-3 py-2 text-sm hover:bg-slate-100 rounded">AI Assistant</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/login')} className="rounded-lg bg-slate-900 text-white px-4 py-2 text-sm">Login</button>
          <button onClick={() => { setDark(!dark); document.documentElement.classList.toggle('dark') }} className="rounded-lg bg-slate-100 px-3 py-2 text-sm">{dark ? 'Light' : 'Dark'}</button>
        </div>
      </div>
    </header>
  )
}
