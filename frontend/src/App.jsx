import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import OfficialHeader from './components/OfficialHeader'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import CitizenPortal from './pages/CitizenPortal'
import OfficerPortal from './pages/OfficerPortal'
import GovernmentPortal from './pages/GovernmentPortal'
import AiAssistant from './components/AiAssistant'

function App() {
  const [language, setLanguage] = useState('en')
  const [fontSize, setFontSize] = useState('A')

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col">
        <OfficialHeader 
          language={language} 
          setLanguage={setLanguage} 
          fontSize={fontSize} 
          setFontSize={setFontSize} 
        />
        <main className="flex-grow mx-auto w-full max-w-7xl p-4 md:p-6">
          <Routes>
            <Route path="/" element={<LandingPage language={language} />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/citizen" element={<CitizenPortal />} />
            <Route path="/officer" element={<OfficerPortal />} />
            <Route path="/government" element={<GovernmentPortal />} />
            <Route path="/dashboard" element={<GovernmentPortal />} />
            <Route path="/ai" element={<AiAssistant apiBase={import.meta.env.VITE_API_BASE || 'http://localhost:8000'} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
