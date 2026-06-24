import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function OfficialHeader({ language, setLanguage, fontSize, setFontSize }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, profile, signOut } = useAuth()
  const [isSticky, setIsSticky] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 140) {
        setIsSticky(true)
      } else {
        setIsSticky(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleAccessibility = (size) => {
    setFontSize(size)
    if (size === 'A-') {
      document.documentElement.style.fontSize = '14px'
    } else if (size === 'A+') {
      document.documentElement.style.fontSize = '18px'
    } else {
      document.documentElement.style.fontSize = '16px'
    }
  }

  const navLinks = [
    { name: { en: 'Home', kn: 'ಮುಖಪುಟ' }, path: '/' },
    { name: { en: 'Citizen Services', kn: 'ನಾಗರಿಕ ಸೇವೆಗಳು' }, path: '/citizen' },
    { name: { en: 'Crime Analytics', kn: 'ಅಪರಾಧ ವಿಶ್ಲೇಷಣೆ' }, path: '/government' },
    { name: { en: 'Crime Mapping', kn: 'ಅಪರಾಧ ನಕ್ಷೆ' }, path: '/dashboard' },
    { name: { en: 'Network Analysis', kn: 'ನೆಟ್‌ವರ್ಕ್ ವಿಶ್ಲೇಷಣೆ' }, path: '/government' },
    { name: { en: 'AI Assistant', kn: 'ಎಐ ಸಹಾಯಕ' }, path: '/ai' },
    { name: { en: 'Reports', kn: 'ವರದಿಗಳು' }, path: '/government' },
    { name: { en: 'Contact', kn: 'ಸಂಪರ್ಕಿಸಿ' }, path: '#footer' },
  ]

  const t = {
    govName: { en: 'GOVERNMENT OF KARNATAKA', kn: 'ಕರ್ನಾಟಕ ಸರ್ಕಾರ' },
    deptName: { en: 'KARNATAKA STATE POLICE', kn: 'ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್' },
    platformName: { en: 'Karnataka Crime Intelligence & Analytical Platform', kn: 'ಕರ್ನಾಟಕ ಅಪರಾಧ ಗುಪ್ತಚರ ಮತ್ತು ವಿಶ್ಲೇಷಣಾತ್ಮಕ ವೇದಿಕೆ' },
    tagline: { en: 'Law and Order through Smart & Predictive Policing', kn: 'ಸ್ಮಾರ್ಟ್ ಮತ್ತು ಮುನ್ಸೂಚಕ ಪೊಲೀಸ್ ವ್ಯವಸ್ಥೆಯ ಮೂಲಕ ಕಾನೂನು ಮತ್ತು ಸುವ್ಯವಸ್ಥೆ' },
    emergency: { en: 'EMERGENCY: 112', kn: 'ತುರ್ತು ಸಂಖ್ಯೆ: 112' },
    citizenLogin: { en: 'Citizen Portal', kn: 'ನಾಗರಿಕ ಪೋರ್ಟಲ್' },
    officerLogin: { en: 'Officer Login', kn: 'ಅಧಿಕಾರಿ ಲಾಗಿನ್' },
    govAccess: { en: 'Government Access', kn: 'ಸರ್ಕಾರಿ ಪ್ರವೇಶ' },
    searchPlaceholder: { en: 'Search portal...', kn: 'ಪೋರ್ಟಲ್ ಹುಡುಕಿ...' },
  }

  if (user) {
    return (
      <div className="w-full bg-[#070D19] text-white select-none py-3 px-6 border-b border-slate-900 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <svg 
              className="w-10 h-10 drop-shadow-sm flex-shrink-0" 
              viewBox="0 0 200 200" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="100" cy="100" r="92" fill="#0B1F4D" stroke="#D4A017" strokeWidth="6" />
              <circle cx="100" cy="100" r="76" fill="#1E40AF" />
              <path d="M70 100 C70 85 85 75 100 85 C100 85 95 105 85 115 C80 120 70 115 70 100 Z" fill="#D4A017" />
              <path d="M130 100 C130 85 115 75 100 85 C100 85 105 105 115 115 C120 120 130 115 130 100 Z" fill="#D4A017" />
            </svg>
            <div className="text-left leading-tight">
              <span className="text-[9px] text-govgold font-bold tracking-wider uppercase block">Government of Karnataka</span>
              <h1 className="text-xs md:text-sm font-black tracking-wide text-white uppercase">
                Karnataka Crime Intelligence & Analytical Platform (KCIAP)
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {profile && (
              <div className="text-right hidden sm:block leading-none">
                <p className="text-[10px] font-bold text-white uppercase">{profile.full_name}</p>
                <span className="text-[8px] text-govgold font-mono uppercase font-bold tracking-wider">{profile.role}</span>
              </div>
            )}
            <button
              onClick={() => signOut().then(() => navigate('/'))}
              className="px-3 py-1.5 bg-red-950/50 border border-red-900/60 hover:bg-red-900/30 text-red-400 hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-white select-none">
      {/* 1. TOP UTILITY BAR */}
      <div className="bg-govnavy text-white text-xs py-2 px-4 border-b border-govgold/30">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          {/* Left: Emergency */}
          <div className="flex items-center gap-3">
            <a 
              href="tel:112" 
              onClick={(e) => {
                e.preventDefault()
                alert("Emergency Services: Dial 112 for immediate assistance. Dispatchers are active 24/7.")
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1 rounded animate-pulse flex items-center gap-1.5 transition duration-150"
            >
              <span className="inline-block w-2.5 h-2.5 bg-white rounded-full"></span>
              {t.emergency[language]}
            </a>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <span className="text-slate-300 hidden sm:inline">{t.tagline[language]}</span>
          </div>

          {/* Right: Accessibility, Language, Logins */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* Accessibility */}
            <div className="flex items-center gap-1">
              <span className="text-slate-400 mr-1">Text Size:</span>
              <button 
                onClick={() => handleAccessibility('A-')}
                className={`px-2 py-0.5 rounded text-xs font-semibold ${fontSize === 'A-' ? 'bg-govgold text-govnavy' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
              >
                A-
              </button>
              <button 
                onClick={() => handleAccessibility('A')}
                className={`px-2 py-0.5 rounded text-xs font-semibold ${fontSize === 'A' ? 'bg-govgold text-govnavy' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
              >
                A
              </button>
              <button 
                onClick={() => handleAccessibility('A+')}
                className={`px-2 py-0.5 rounded text-xs font-semibold ${fontSize === 'A+' ? 'bg-govgold text-govnavy' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
              >
                A+
              </button>
            </div>

            <span className="text-slate-600">|</span>

            {/* Language Selector */}
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded text-xs font-semibold ${language === 'en' ? 'bg-govgold text-govnavy' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
              >
                English
              </button>
              <button 
                onClick={() => setLanguage('kn')}
                className={`px-2 py-0.5 rounded text-xs font-semibold ${language === 'kn' ? 'bg-govgold text-govnavy' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
              >
                ಕನ್ನಡ
              </button>
            </div>

            <span className="text-slate-600">|</span>

            {/* Quick Portal Access */}
            <div className="flex gap-2 items-center text-slate-300 text-xs">
              {user ? (
                <>
                  <span className="text-govgold font-medium">
                    {profile ? `${profile.full_name} (${profile.role})` : user.email}
                  </span>
                  <span className="text-slate-600">·</span>
                  <button onClick={signOut} className="text-rose-400 hover:text-rose-300 transition font-semibold">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => navigate('/citizen')} className="hover:text-govgold transition">{t.citizenLogin[language]}</button>
                  <span className="text-slate-600">·</span>
                  <button onClick={() => navigate('/login')} className="hover:text-govgold transition">{t.officerLogin[language]}</button>
                  <span className="text-slate-600">·</span>
                  <button onClick={() => navigate('/government')} className="hover:text-govgold transition">{t.govAccess[language]}</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. OFFICIAL HEADER */}
      <div className="bg-white py-4 px-4 border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Logo & Texts */}
          <div className="flex items-center gap-4">
            {/* Karnataka Police Emblem SVG */}
            <svg 
              className="w-16 h-16 md:w-20 md:h-20 drop-shadow-sm flex-shrink-0" 
              viewBox="0 0 200 200" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer Circular Shield */}
              <circle cx="100" cy="100" r="92" fill="#0B1F4D" stroke="#D4A017" strokeWidth="6" />
              <circle cx="100" cy="100" r="82" stroke="#ffffff" strokeWidth="2" />
              <circle cx="100" cy="100" r="76" fill="#1E40AF" />
              
              {/* Emblem Centerpiece: Karnataka Emblem Motif Ganda Bherunda */}
              {/* Left Wing */}
              <path d="M70 100 C70 85 85 75 100 85 C100 85 95 105 85 115 C80 120 70 115 70 100 Z" fill="#D4A017" stroke="#ffffff" strokeWidth="1" />
              {/* Right Wing */}
              <path d="M130 100 C130 85 115 75 100 85 C100 85 105 105 115 115 C120 120 130 115 130 100 Z" fill="#D4A017" stroke="#ffffff" strokeWidth="1" />
              {/* Double Heads */}
              <path d="M90 75 C90 70 95 65 100 70 C100 70 98 75 96 78 Z" fill="#D4A017" />
              <path d="M110 75 C110 70 105 65 100 70 C100 70 102 75 104 78 Z" fill="#D4A017" />
              {/* Center Body & Tail */}
              <path d="M96 85 H104 L106 125 C106 135 94 135 94 125 Z" fill="#D4A017" stroke="#ffffff" strokeWidth="1" />
              <path d="M100 120 L85 140 H115 L100 120 Z" fill="#D4A017" />
              
              {/* Sceptre/Sword elements and text banner */}
              <rect x="98" y="45" width="4" height="25" rx="2" fill="#D4A017" stroke="#ffffff" strokeWidth="0.5" />
              <circle cx="100" cy="42" r="3" fill="#D4A017" />
              
              {/* Shield details */}
              <circle cx="100" cy="100" r="6" fill="#D4A017" stroke="#ffffff" strokeWidth="1" />
            </svg>
            
            {/* Title Texts */}
            <div>
              <div className="flex flex-col">
                <span className="text-xs md:text-sm font-bold text-govblue tracking-wider">{t.govName[language]}</span>
                <span className="text-sm md:text-base font-extrabold text-govnavy tracking-wide">{t.deptName[language]}</span>
              </div>
              <h1 className="text-lg md:text-2xl font-black text-govnavy mt-1 leading-tight border-l-4 border-govgold pl-3">
                {t.platformName[language]}
              </h1>
              <span className="text-xs text-slate-500 font-semibold block mt-0.5 tracking-wide uppercase">
                {language === 'en' ? 'State Command & Control Hub' : 'ರಾಜ್ಯ ಕಮಾಂಡ್ ಮತ್ತು ಕಂಟ್ರೋಲ್ ಹಬ್'}
              </span>
            </div>
          </div>

          {/* Search bar */}
          <div className="w-full md:w-72 flex-shrink-0">
            <form onSubmit={(e) => {
              e.preventDefault()
              alert(`Portal Search: Searching for "${searchQuery}" is currently in offline demonstration mode.`)
            }} className="relative flex items-center">
              <input
                type="text"
                placeholder={t.searchPlaceholder[language]}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-govblue focus:border-transparent transition"
              />
              <button 
                type="submit"
                className="absolute right-2 text-slate-400 hover:text-govblue transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 3. NAVIGATION (Sticky navigation on scroll) */}
      <nav className={`${isSticky ? 'fixed top-0 left-0 w-full shadow-lg z-50 border-b border-govgold bg-govnavy text-white' : 'bg-govnavy text-white'} transition-all duration-300`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4">
          
          {/* Logo overlay on sticky scroll */}
          {isSticky && (
            <div className="flex items-center gap-2 py-2 cursor-pointer" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); navigate('/'); }}>
              <svg className="w-8 h-8" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="92" fill="#0B1F4D" stroke="#D4A017" strokeWidth="8"/>
                <circle cx="100" cy="100" r="70" fill="#1E40AF"/>
                <path d="M100 50 L100 150 M50 100 L150 100" stroke="#D4A017" strokeWidth="12" strokeLinecap="round"/>
              </svg>
              <span className="text-xs font-bold text-govgold tracking-wider hidden lg:block uppercase">KCIAP</span>
            </div>
          )}

          {/* Links list */}
          <div className="flex flex-grow justify-start overflow-x-auto no-scrollbar py-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path && link.path !== '#footer'
              return (
                <button
                  key={link.name.en}
                  onClick={() => {
                    if (link.path.startsWith('#')) {
                      const el = document.getElementById(link.path.replace('#', ''))
                      if (el) el.scrollIntoView({ behavior: 'smooth' })
                    } else {
                      navigate(link.path)
                    }
                  }}
                  className={`px-4 py-3 text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-150 relative flex-shrink-0 whitespace-nowrap
                    ${isActive 
                      ? 'text-govgold bg-slate-900 border-b-2 border-govgold' 
                      : 'text-slate-100 hover:text-govgold hover:bg-slate-800'
                    }`}
                >
                  {link.name[language]}
                </button>
              )
            })}
          </div>

          {/* Quick link to Command Center */}
          <button 
            onClick={() => navigate('/login')} 
            className="ml-4 px-4 py-1.5 bg-govgold text-govnavy font-bold rounded text-xs hover:bg-yellow-500 transition duration-150 uppercase tracking-wider flex-shrink-0"
          >
            {language === 'en' ? 'Secure Access' : 'ಸುರಕ್ಷಿತ ಪ್ರವೇಶ'}
          </button>
        </div>
      </nav>
    </div>
  )
}
