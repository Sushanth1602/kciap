import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import HeroMap from '../components/HeroMap'
import CrimeTrendChart from '../components/CrimeTrendChart'
import DistrictBarChart from '../components/DistrictBarChart'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export default function LandingPage({ language }) {
  const navigate = useNavigate()
  
  // Dashboard & Analytics states
  const [summary, setSummary] = useState({ 
    total_crimes: 10000, 
    active_cases: 7910, 
    closed_cases: 2090, 
    high_severity_cases: 4105,
    districts_monitored: 31,
    registered_officers: 1250
  })
  const [districts, setDistricts] = useState([])
  const [trends, setTrends] = useState([])
  const [hotspots, setHotspots] = useState([])

  // AI Chat states
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: { en: "Welcome to KCIAP AI Assistant. How can I assist you with crime intelligence query today?", kn: "ಕೆ.ಸಿ.ಐ.ಎ.ಪಿ ಎಐ ಸಹಾಯಕಕ್ಕೆ ಸುಸ್ವಾಗತ. ಅಪರಾಧ ಗುಪ್ತಚರ ಪ್ರಶ್ನೆಗಳಿಗೆ ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?" } }
  ])
  const [question, setQuestion] = useState('')
  const [chatLoading, setChatLoading] = useState(false)

  // Fetch stats from backend
  useEffect(() => {
    async function loadStats() {
      try {
        const [summaryRes, districtsRes, trendsRes, hotspotsRes] = await Promise.all([
          fetch(`${API_BASE}/analytics/summary`).then((res) => res.json()).catch(() => null),
          fetch(`${API_BASE}/analytics/crimes-by-district`).then((res) => res.json()).catch(() => []),
          fetch(`${API_BASE}/analytics/monthly-trends`).then((res) => res.json()).catch(() => []),
          fetch(`${API_BASE}/analytics/hotspots`).then((res) => res.json()).catch(() => ({ hotspots: [] })),
        ])
        
        if (summaryRes && typeof summaryRes.total_crimes === 'number') {
          setSummary({
            total_crimes: summaryRes.total_crimes,
            active_cases: summaryRes.active_cases || 7910,
            closed_cases: summaryRes.closed_cases || 2090,
            high_severity_cases: summaryRes.high_severity_cases || 4105,
            districts_monitored: Array.isArray(districtsRes) ? districtsRes.length : 31,
            registered_officers: 1250 + (summaryRes.total_crimes % 100)
          })
        }
        if (Array.isArray(districtsRes)) setDistricts(districtsRes)
        if (Array.isArray(trendsRes)) setTrends(trendsRes)
        if (hotspotsRes && Array.isArray(hotspotsRes.hotspots)) setHotspots(hotspotsRes.hotspots)
      } catch (error) {
        console.error("Failed to load statistics from backend:", error)
      }
    }
    loadStats()
  }, [])

  const topDistricts = useMemo(() => districts.slice(0, 5), [districts])

  // AI Chat Ask Handler
  const handleAsk = async (textToSend) => {
    const query = textToSend || question
    if (!query.trim()) return

    // User Message
    const userMsg = { sender: 'user', text: { en: query, kn: query } }
    setChatMessages((prev) => [...prev, userMsg])
    setQuestion('')
    setChatLoading(true)

    try {
      const response = await fetch(`${API_BASE}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query }),
      })
      const data = await response.json()
      
      // AI Message
      const aiMsg = { sender: 'ai', text: { en: data.answer || 'No response details received.', kn: data.answer || 'ಯಾವುದೇ ಪ್ರತಿಕ್ರಿಯೆ ಲಭ್ಯವಿಲ್ಲ.' } }
      setChatMessages((prev) => [...prev, aiMsg])
    } catch (error) {
      const errorMsg = { sender: 'ai', text: { en: "Failed to fetch response. Please ensure backend services are active.", kn: "ಪ್ರತಿಕ್ರಿಯೆ ಪಡೆಯಲು ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಬ್ಯಾಕೆಂಡ್ ಸೇವೆಗಳು ಸಕ್ರಿಯವಾಗಿವೆ ಎಂದು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ." } }
      setChatMessages((prev) => [...prev, errorMsg])
      console.error(error)
    } finally {
      setChatLoading(false)
    }
  }

  // Predefined prompts for AI assistant
  const samplePrompts = [
    { en: "Show burglary trends in Bengaluru.", kn: "ಬೆಂಗಳೂರಿನಲ್ಲಿ ಕನ್ನಗಳ್ಳತನದ ಪ್ರವೃತ್ತಿಗಳನ್ನು ತೋರಿಸಿ." },
    { en: "List high severity cases from last month.", kn: "ಕಳೆದ ತಿಂಗಳ ಹೆಚ್ಚಿನ ತೀವ್ರತೆಯ ಪ್ರಕರಣಗಳನ್ನು ಪಟ್ಟಿ ಮಾಡಿ." },
    { en: "Identify repeat offenders.", kn: "ಪುನರಾವರ್ತಿತ ಅಪರಾಧಿಗಳನ್ನು ಗುರುತಿಸಿ." }
  ]

  // Translation Dictionaries
  const t = {
    // Hero
    heroTitle: { en: "AI-Powered Crime Intelligence for a Safer Karnataka", kn: "ಸುರಕ್ಷಿತ ಕರ್ನಾಟಕಕ್ಕಾಗಿ ಎಐ-ಚಾಲಿತ ಅಪರಾಧ ಗುಪ್ತಚರ" },
    heroSub: { en: "Unified platform for crime analytics, hotspot detection, criminal network analysis and strategic policing.", kn: "ಅಪರಾಧ ವಿಶ್ಲೇಷಣೆ, ಹಾಟ್‌ಸ್ಪಾಟ್ ಪತ್ತೆ, ಕ್ರಿಮಿನಲ್ ನೆಟ್‌ವರ್ಕ್ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಕಾರ್ಯತಂತ್ರದ ಪೊಲೀಸ್ ವ್ಯವಸ್ಥೆಗಾಗಿ ಏಕೀಕೃತ ವೇದಿಕೆ." },
    citizenPortalBtn: { en: "Citizen Portal Access", kn: "ನಾಗರಿಕ ಪೋರ್ಟಲ್ ಪ್ರವೇಶ" },
    officerPortalBtn: { en: "Secure Officer Portal", kn: "ಸುರಕ್ಷಿತ ಅಧಿಕಾರಿ ಪೋರ್ಟಲ್" },
    govtDashboardBtn: { en: "Government Dashboard", kn: "ಸರ್ಕಾರಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್" },

    // Live Dashboard
    dashTitle: { en: "State Security Operations Dashboard", kn: "ರಾಜ್ಯ ಭದ್ರತಾ ಕಾರ್ಯಾಚರಣೆಗಳ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್" },
    dashSub: { en: "Real-time metrics and state-wide consolidated crime tracking", kn: "ನೈಜ-ಸಮಯದ ಅಂಕಿಅಂಶಗಳು ಮತ್ತು ರಾಜ್ಯಾದ್ಯಂತ ಕ್ರೋಢೀಕರಿಸಿದ ಅಪರಾಧ ಟ್ರ್ಯಾಕಿಂಗ್" },
    kpiTotal: { en: "Total Incidents", kn: "ಒಟ್ಟು ಅಪರಾಧಗಳು" },
    kpiActive: { en: "Active Cases", kn: "ಸಕ್ರಿಯ ಪ್ರಕರಣಗಳು" },
    kpiClosed: { en: "Closed Cases", kn: "ಮುಚ್ಚಲ್ಪಟ್ಟ ಪ್ರಕರಣಗಳು" },
    kpiSeverity: { en: "High Severity Cases", kn: "ಹೆಚ್ಚಿನ ತೀವ್ರತೆಯ ಪ್ರಕರಣಗಳು" },
    kpiDistricts: { en: "Districts Monitored", kn: "ಮೇಲ್ವಿಚಾರಣೆಯ ಜಿಲ್ಲೆಗಳು" },
    kpiOfficers: { en: "Registered Officers", kn: "ನೋಂದಾಯಿತ ಅಧಿಕಾರಿಗಳು" },

    // Capabilities
    capTitle: { en: "Platform Analytical Capabilities", kn: "ವೇದಿಕೆಯ ವಿಶ್ಲೇಷಣಾತ್ಮಕ ಸಾಮರ್ಥ್ಯಗಳು" },
    capSub: { en: "State-of-the-art predictive intelligence modules and decision support systems", kn: "ಅತ್ಯಾಧುನಿಕ ಭವಿಷ್ಯಸೂಚಕ ಗುಪ್ತಚರ ಮಾಡ್ಯೂಲ್‌ಗಳು ಮತ್ತು ನಿರ್ಧಾರ ಬೆಂಬಲ ವ್ಯವಸ್ಥೆಗಳು" },
    cap1: { en: "Crime Analytics", kn: "ಅಪರಾಧ ವಿಶ್ಲೇಷಣೆ" },
    cap1Desc: { en: "Comprehensive analytics of crime parameters and statistics.", kn: "ಅಪರಾಧದ ನಿಯತಾಂಕಗಳು ಮತ್ತು ಅಂಕಿಅಂಶಗಳ ಸಮಗ್ರ ವಿಶ್ಲೇಷಣೆ." },
    cap2: { en: "Crime Mapping", kn: "ಅಪರಾಧ ನಕ್ಷೆ" },
    cap2Desc: { en: "Interactive geographical visualization of crime distribution.", kn: "ಅಪರಾಧ ಹರಡುವಿಕೆಯ ಸಂವಾದಾತ್ಮಕ ಭೌಗೋಳಿಕ ದೃಶ್ಯೀಕರಣ." },
    cap3: { en: "Hotspot Detection", kn: "ಹಾಟ್‌ಸ್ಪಾಟ್ ಪತ್ತೆ" },
    cap3Desc: { en: "Clustering algorithms identifying crime concentration zones.", kn: "ಅಪರಾಧ ಸಾಂದ್ರತೆಯ ವಲಯಗಳನ್ನು ಗುರುತಿಸುವ ಕ್ಲಸ್ಟರಿಂಗ್ ಅಲ್ಗಾರಿದಮ್‌ಗಳು." },
    cap4: { en: "AI Crime Assistant", kn: "ಎಐ ಅಪರಾಧ ಸಹಾಯಕ" },
    cap4Desc: { en: "Natural language query engine returning actionable intelligence.", kn: "ಕಾರ್ಯಗತಗೊಳಿಸಬಹುದಾದ ಬುದ್ಧಿವಂತಿಕೆಯನ್ನು ನೀಡುವ ನೈಸರ್ಗಿಕ ಭಾಷಾ ಪ್ರಶ್ನೆ ಎಂಜಿನ್." },
    cap5: { en: "Criminal Network Analysis", kn: "ಕ್ರಿಮಿನಲ್ ನೆಟ್‌ವರ್ಕ್ ವಿಶ್ಲೇಷಣೆ" },
    cap5Desc: { en: "Visual link-charts modeling crime-suspect associations.", kn: "ಅಪರಾಧ-ಶಂಕಿತ ಸಂಯೋಜನೆಗಳನ್ನು ತೋರಿಸುವ ಲಿಂಕ್-ಚಾರ್ಟ್‌ಗಳು." },
    cap6: { en: "Predictive Intelligence", kn: "ಮುನ್ಸೂಚಕ ಗುಪ್ತಚರ" },
    cap6Desc: { en: "Historical modeling predicting high probability future occurrence.", kn: "ಭವಿಷ್ಯದ ಅಪರಾಧ ಮುನ್ಸೂಚನೆಯನ್ನು ಊಹಿಸುವ ಐತಿಹಾಸಿಕ ಮಾಡೆಲಿಂಗ್." },
    cap7: { en: "Case Management", kn: "ಪ್ರಕರಣ ನಿರ್ವಹಣೆ" },
    cap7Desc: { en: "Tracking FIR investigation steps from filing to final chargesheet.", kn: "ದಾಖಲಾತಿಯಿಂದ ಚಾರ್ಜ್‌ಶೀಟ್‌ವರೆಗೆ ಎಫ್‌ಐಆರ್ ತನಿಖಾ ಹಂತಗಳ ಟ್ರ್ಯಾಕಿಂಗ್." },
    cap8: { en: "Real-Time Monitoring", kn: "ನೈಜ-ಸಮಯದ ಮೇಲ್ವಿಚಾರಣೆ" },
    cap8Desc: { en: "Continuous updates of regional emergency alerts and dispatches.", kn: "ಪ್ರಾದೇಶಿಕ ತುರ್ತು ಎಚ್ಚರಿಕೆಗಳು ಮತ್ತು ಪ್ರಸರಣಗಳ ನಿರಂತರ ನವೀಕರಣಗಳು." },

    // Citizen Services
    citTitle: { en: "Citizen Services Portal", kn: "ನಾಗರಿಕ ಸೇವೆಗಳ ಪೋರ್ಟಲ್" },
    citSub: { en: "Direct online interfaces for public safety and administrative services", kn: "ಸಾರ್ವಜನಿಕ ಸುರಕ್ಷತೆ ಮತ್ತು ಆಡಳಿತಾತ್ಮಕ ಸೇವೆಗಳಿಗಾಗಿ ನೇರ ಆನ್‌ಲೈನ್ ಇಂಟರ್ಫೇಸ್‌ಗಳು" },
    cit1: { en: "File Online Complaint", kn: "ಆನ್‌ಲೈನ್ ದೂರು ಸಲ್ಲಿಸಿ" },
    cit1Desc: { en: "Register non-emergency complaints directly to jurisdictional stations.", kn: "ಅಧಿಕಾರ ವ್ಯಾಪ್ತಿಯ ಠಾಣೆಗಳಿಗೆ ನೇರವಾಗಿ ದೂರುಗಳನ್ನು ನೋಂದಾಯಿಸಿ." },
    cit2: { en: "Track FIR Status", kn: "ಎಫ್ಐಆರ್ ಸ್ಥಿತಿ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ" },
    cit2Desc: { en: "Check real-time case updates using FIR registration parameters.", kn: "ಎಫ್‌ಐಆರ್ ಸಂಖ್ಯೆ ಬಳಸಿ ನೈಜ-ಸಮಯದ ಪ್ರಕರಣದ ಅಪ್‌ಡೇಟ್ ಪರಿಶೀಲಿಸಿ." },
    cit3: { en: "Cyber Crime Reporting", kn: "ಸೈಬರ್ ಅಪರಾಧ ವರದಿ" },
    cit3Desc: { en: "Specialized portal to report financial fraud and online harassment.", kn: "ಹಣಕಾಸು ವಂಚನೆ ಮತ್ತು ಆನ್‌ಲೈನ್ ಕಿರುಕುಳ ವರದಿ ಮಾಡಲು ವಿಶೇಷ ಪೋರ್ಟಲ್." },
    cit4: { en: "Emergency Assistance", kn: "ತುರ್ತು ನೆರವು" },
    cit4Desc: { en: "Direct contact options for rapid response dispatch and KSP squads.", kn: "ತ್ವರಿತ ಪ್ರತಿಕ್ರಿಯೆ ರವಾನೆ ಮತ್ತು ಕೆಎಸ್ಪಿ ಸ್ಕ್ವಾಡ್‌ಗಳಿಗಾಗಿ ನೇರ ಸಂಪರ್ಕಗಳು." },
    cit5: { en: "Missing Persons Directory", kn: "ಕಾಣೆಯಾದ ವ್ಯಕ್ತಿಗಳ ಡೈರೆಕ್ಟರಿ" },
    cit5Desc: { en: "Public database of active missing cases and unidentified details.", kn: "ಕಾಣೆಯಾದ ಸಕ್ರಿಯ ಪ್ರಕರಣಗಳ ಸಾರ್ವಜನಿಕ ಡೇಟಾಬೇಸ್." },
    cit6: { en: "Safety Resources & Acts", kn: "ಸುರಕ್ಷತಾ ಸಂಪನ್ಮೂಲಗಳು ಮತ್ತು ಕಾಯಿದೆಗಳು" },
    cit6Desc: { en: "Legal documentation, safety manuals, and local station contact sheets.", kn: "ಕಾನೂನು ದಾಖಲೆಗಳು, ಸುರಕ್ಷತಾ ಕೈಪಿಡಿಗಳು ಮತ್ತು ಸ್ಥಳೀಯ ಠಾಣೆಗಳ ಸಂಪರ್ಕಗಳು." },

    // Officer Command Center
    cmdTitle: { en: "Officer Command Center Preview", kn: "ಅಧಿಕಾರಿ ಕಮಾಂಡ್ ಸೆಂಟರ್ ಪೂರ್ವವೀಕ್ಷಣೆ" },
    cmdSub: { en: "Restricted command dashboard mock-up with analytical visualizations", kn: "ವಿಶ್ಲೇಷಣಾತ್ಮಕ ದೃಶ್ಯೀಕರಣಗಳೊಂದಿಗೆ ನಿರ್ಬಂಧಿತ ಕಮಾಂಡ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಪೂರ್ವವೀಕ್ಷಣೆ" },

    // AI Assistant
    aiTitle: { en: "AI Crime Intelligence assistant", kn: "ಎಐ ಅಪರಾಧ ಗುಪ್ತಚರ ಸಹಾಯಕ" },
    aiSub: { en: "Ask questions to the unified databases in natural language", kn: "ನೈಸರ್ಗಿಕ ಭಾಷೆಯಲ್ಲಿ ಏಕೀಕೃತ ಡೇಟಾಬೇಸ್‌ಗಳಿಗೆ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ" },

    // Footer
    deptName: { en: "Karnataka State Police Department", kn: "ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ ಇಲಾಖೆ" }
  }

  return (
    <div className="space-y-16 py-8">
      {/* 4. HERO SECTION */}
      <section className="grid gap-8 lg:grid-cols-12 items-center bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
        
        {/* Left text panel */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-govblue/10 border border-govblue/30 rounded-full text-xs font-bold text-govblue uppercase tracking-wider">
            <span className="w-2 h-2 bg-govgold rounded-full"></span>
            Official KSP Web Intelligence
          </div>
          
          <h2 className="text-3xl md:text-5xl font-black text-govnavy leading-tight tracking-tight">
            {t.heroTitle[language]}
          </h2>
          
          <p className="text-slate-600 text-base md:text-lg leading-relaxed">
            {t.heroSub[language]}
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button 
              onClick={() => navigate('/citizen')} 
              className="bg-govblue text-white hover:bg-blue-800 px-6 py-3.5 rounded-xl font-bold text-sm shadow-sm transition hover:shadow duration-150 uppercase tracking-wider border-b-4 border-blue-900"
            >
              {t.citizenPortalBtn[language]}
            </button>
            <button 
              onClick={() => navigate('/login')} 
              className="bg-govnavy text-white hover:bg-slate-800 px-6 py-3.5 rounded-xl font-bold text-sm shadow-sm transition hover:shadow duration-150 uppercase tracking-wider border-b-4 border-slate-950"
            >
              {t.officerPortalBtn[language]}
            </button>
            <button 
              onClick={() => navigate('/government')} 
              className="bg-white border border-slate-300 text-govnavy hover:bg-slate-50 px-6 py-3.5 rounded-xl font-bold text-sm shadow-sm transition duration-150 uppercase tracking-wider"
            >
              {t.govtDashboardBtn[language]}
            </button>
          </div>
        </div>

        {/* Right Map Panel */}
        <div className="lg:col-span-6 h-[480px]">
          <HeroMap hotspots={hotspots} districtStats={districts} />
        </div>
      </section>

      {/* 5. LIVE STATE DASHBOARD */}
      <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-govnavy uppercase tracking-wide border-l-4 border-govgold pl-3">
            {t.dashTitle[language]}
          </h2>
          <p className="text-xs md:text-sm text-slate-500 font-semibold mt-1">
            {t.dashSub[language]}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-govblue"></div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{t.kpiTotal[language]}</div>
            <div className="mt-2 text-2xl font-black text-govnavy">{summary.total_crimes.toLocaleString()}</div>
            <span className="text-[10px] text-red-500 font-semibold mt-1 inline-block">↑ state consolidated</span>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-govgold"></div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{t.kpiActive[language]}</div>
            <div className="mt-2 text-2xl font-black text-govnavy">{summary.active_cases.toLocaleString()}</div>
            <span className="text-[10px] text-orange-500 font-semibold mt-1 inline-block">{(summary.active_cases/summary.total_crimes*100).toFixed(1)}% of total</span>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-green-600"></div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{t.kpiClosed[language]}</div>
            <div className="mt-2 text-2xl font-black text-govnavy">{summary.closed_cases.toLocaleString()}</div>
            <span className="text-[10px] text-green-600 font-semibold mt-1 inline-block">{(summary.closed_cases/summary.total_crimes*100).toFixed(1)}% clearance</span>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{t.kpiSeverity[language]}</div>
            <div className="mt-2 text-2xl font-black text-govnavy">{summary.high_severity_cases.toLocaleString()}</div>
            <span className="text-[10px] text-slate-500 font-semibold mt-1 inline-block">severity level 4-5</span>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-purple-600"></div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{t.kpiDistricts[language]}</div>
            <div className="mt-2 text-2xl font-black text-govnavy">{summary.districts_monitored}</div>
            <span className="text-[10px] text-purple-600 font-semibold mt-1 inline-block">31 administrative hq</span>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-sky-600"></div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{t.kpiOfficers[language]}</div>
            <div className="mt-2 text-2xl font-black text-govnavy">{summary.registered_officers}+</div>
            <span className="text-[10px] text-sky-600 font-semibold mt-1 inline-block">active terminal logins</span>
          </div>
        </div>
      </section>

      {/* 6. PLATFORM CAPABILITIES SECTION */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <h2 className="text-2xl md:text-3xl font-black text-govnavy uppercase tracking-wide">
            {t.capTitle[language]}
          </h2>
          <p className="text-sm text-slate-500 font-semibold">
            {t.capSub[language]}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: t.cap1[language], desc: t.cap1Desc[language], icon: "📊" },
            { title: t.cap2[language], desc: t.cap2Desc[language], icon: "🗺️" },
            { title: t.cap3[language], desc: t.cap3Desc[language], icon: "🎯" },
            { title: t.cap4[language], desc: t.cap4Desc[language], icon: "🤖" },
            { title: t.cap5[language], desc: t.cap5Desc[language], icon: "🕸️" },
            { title: t.cap6[language], desc: t.cap6Desc[language], icon: "🔮" },
            { title: t.cap7[language], desc: t.cap7Desc[language], icon: "📂" },
            { title: t.cap8[language], desc: t.cap8Desc[language], icon: "🚨" },
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl shadow-sm hover:border-govgold hover:bg-white transition duration-200 group">
              <div className="text-3xl mb-4 group-hover:scale-110 transition duration-150 inline-block">{item.icon}</div>
              <h3 className="text-base font-extrabold text-govnavy group-hover:text-govblue transition mb-2">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CITIZEN SERVICES SECTION */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <h2 className="text-2xl md:text-3xl font-black text-govnavy uppercase tracking-wide">
            {t.citTitle[language]}
          </h2>
          <p className="text-sm text-slate-500 font-semibold">
            {t.citSub[language]}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: t.cit1[language], desc: t.cit1Desc[language], icon: "📝", action: () => navigate('/citizen') },
            { title: t.cit2[language], desc: t.cit2Desc[language], icon: "🔍", action: () => navigate('/citizen') },
            { title: t.cit3[language], desc: t.cit3Desc[language], icon: "💻", action: () => navigate('/citizen') },
            { title: t.cit4[language], desc: t.cit4Desc[language], icon: "📞", action: () => navigate('/citizen') },
            { title: t.cit5[language], desc: t.cit5Desc[language], icon: "👤", action: () => navigate('/citizen') },
            { title: t.cit6[language], desc: t.cit6Desc[language], icon: "📚", action: () => navigate('/citizen') },
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md hover:border-govblue transition duration-200">
              <div>
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="text-base font-extrabold text-govnavy mb-2">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">{item.desc}</p>
              </div>
              <button 
                onClick={item.action} 
                className="w-full text-center py-2 bg-white hover:bg-govblue border border-slate-300 hover:border-transparent rounded-xl text-xs font-bold text-govnavy hover:text-white transition duration-150 uppercase"
              >
                {language === 'en' ? 'Access Service' : 'ಸೇವೆ ಪಡೆಯಿರಿ'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 8. OFFICER COMMAND CENTER PREVIEW */}
      <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6">
        <div>
          <div className="inline-block px-2.5 py-1 bg-red-100 border border-red-200 text-red-700 font-extrabold text-[10px] rounded uppercase tracking-wider mb-2">
            ⚠️ Restricted Access Demo
          </div>
          <h2 className="text-xl md:text-2xl font-black text-govnavy uppercase tracking-wide border-l-4 border-govgold pl-3">
            {t.cmdTitle[language]}
          </h2>
          <p className="text-xs md:text-sm text-slate-500 font-semibold mt-1">
            {t.cmdSub[language]}
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-12">
          {/* Chart Panel */}
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm xl:col-span-8 space-y-4">
            <h3 className="text-sm font-bold text-govnavy uppercase tracking-wider">{language === 'en' ? 'State Crime incident Trends (Yearly)' : 'ರಾಜ್ಯ ಅಪರಾಧ ಘಟನೆಗಳ ಪ್ರವೃತ್ತಿ'}</h3>
            <CrimeTrendChart data={trends} />
          </div>

          {/* Bar Chart and Alerts */}
          <div className="xl:col-span-4 grid gap-6">
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-govnavy uppercase tracking-wider">{language === 'en' ? 'High Severity Districts' : 'ಹೆಚ್ಚಿನ ತೀವ್ರತೆಯ ಜಿಲ್ಲೆಗಳು'}</h3>
              <DistrictBarChart data={topDistricts} />
            </div>
          </div>
        </div>

        {/* Incident Alerts List */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-govnavy uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            {language === 'en' ? 'Active Dispatch Alerts' : 'ಸಕ್ರಿಯ ರವಾನೆ ಎಚ್ಚರಿಕೆಗಳು'}
          </h3>
          <div className="max-h-48 overflow-y-auto space-y-2.5 pr-2">
            {[
              { id: "AL-8902", type: "Burglary", location: "Koramangala, Bengaluru Urban", status: "Active Dispatch", time: "2 mins ago", severity: "High" },
              { id: "AL-8901", type: "Cyber Fraud Scam", location: "VV Mohalla, Mysuru", status: "Investigation", time: "15 mins ago", severity: "Medium" },
              { id: "AL-8900", type: "Vehicle Theft", location: "Pandeshwar, Mangaluru", status: "Arrested", time: "30 mins ago", severity: "Low" },
              { id: "AL-8899", type: "Drug Offence", location: "Gokul Road, Hubballi", status: "Active Dispatch", time: "1 hour ago", severity: "High" },
            ].map((alert, idx) => (
              <div key={idx} className="flex justify-between items-center bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-govnavy">{alert.id}</span>
                    <span className="text-slate-400">·</span>
                    <span className="font-bold text-govblue">{alert.type}</span>
                  </div>
                  <div className="text-slate-500">{alert.location}</div>
                </div>
                <div className="text-right space-y-1">
                  <div className={`font-bold px-2 py-0.5 rounded text-[10px] inline-block uppercase
                    ${alert.severity === 'High' ? 'bg-red-100 text-red-700' : alert.severity === 'Medium' ? 'bg-orange-100 text-orange-700' : 'bg-slate-200 text-slate-600'}`}>
                    {alert.severity}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">{alert.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. AI ASSISTANT SECTION */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-govnavy uppercase tracking-wide border-l-4 border-govgold pl-3">
            {t.aiTitle[language]}
          </h2>
          <p className="text-xs md:text-sm text-slate-500 font-semibold mt-1">
            {t.aiSub[language]}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12 items-stretch">
          {/* Chat Window Panel */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 lg:col-span-8 flex flex-col h-[400px]">
            {/* Message Area */}
            <div className="flex-grow overflow-y-auto space-y-3 mb-4 pr-1">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-3 text-xs md:text-sm leading-relaxed shadow-sm
                    ${msg.sender === 'user' 
                      ? 'bg-govblue text-white rounded-tr-none' 
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                    }`}
                  >
                    <div className="font-bold text-[10px] text-slate-400 mb-1">
                      {msg.sender === 'user' ? 'OFFICER TERMINAL' : 'KCIAP INTEL ENGINE'}
                    </div>
                    <div>{msg.text[language] || msg.text['en']}</div>
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3 text-xs text-slate-500 shadow-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-govnavy rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-govnavy rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-govnavy rounded-full animate-bounce delay-150"></span>
                    <span>Querying database...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={(e) => { e.preventDefault(); handleAsk(); }} className="flex gap-2">
              <input
                type="text"
                placeholder={language === 'en' ? 'Type crime intelligence query...' : 'ಅಪರಾಧ ಗುಪ್ತಚರ ಪ್ರಶ್ನೆಯನ್ನು ಟೈಪ್ ಮಾಡಿ...'}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="flex-grow pl-4 pr-3 py-3 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-govblue focus:border-transparent transition"
              />
              <button
                type="submit"
                disabled={chatLoading}
                className="bg-govnavy hover:bg-slate-800 text-white font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-wider transition disabled:opacity-50"
              >
                {language === 'en' ? 'Submit' : 'ಸಲ್ಲಿಸು'}
              </button>
            </form>
          </div>

          {/* Suggestions Panel */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 lg:col-span-4 flex flex-col justify-start space-y-4">
            <h3 className="text-xs font-bold text-govnavy uppercase tracking-wider">
              {language === 'en' ? 'Suggested Queries' : 'ಸೂಚಿಸಲಾದ ಪ್ರಶ್ನೆಗಳು'}
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
              {language === 'en' 
                ? 'Select a query below to automatically extract data analytics from our unified police record database.'
                : 'ನಮ್ಮ ಏಕೀಕೃತ ಪೊಲೀಸ್ ದಾಖಲೆ ಡೇಟಾಬೇಸ್‌ನಿಂದ ಡೇಟಾ ವಿಶ್ಲೇಷಣೆಯನ್ನು ಪಡೆಯಲು ಕೆಳಗಿನ ಪ್ರಶ್ನೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.'}
            </p>
            <div className="space-y-2">
              {samplePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAsk(prompt.en)}
                  className="w-full text-left p-3 bg-white hover:bg-govblue/5 border border-slate-200 hover:border-govblue rounded-xl text-xs font-bold text-slate-700 hover:text-govblue transition duration-150 leading-normal"
                >
                  {prompt[language]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer id="footer" className="bg-govnavy text-slate-300 border-t-4 border-govgold rounded-t-3xl p-8 md:p-12 space-y-8">
        <div className="max-w-7xl mx-auto grid gap-8 md:grid-cols-4">
          {/* Column 1: Dept */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">{t.deptName[language]}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'en' 
                ? 'State Crime Intelligence & Analytical Platform (KCIAP) is a secure nodal interface designed for predictive crime control, network link mapping, and police station management.'
                : 'ರಾಜ್ಯ ಅಪರಾಧ ಗುಪ್ತಚರ ಮತ್ತು ವಿಶ್ಲೇಷಣಾತ್ಮಕ ವೇದಿಕೆ (ಕೆ.ಸಿ.ಐ.ಎ.ಪಿ) ಎನ್ನುವುದು ಅಪರಾಧ ನಿಯಂತ್ರಣ ಮತ್ತು ಪೊಲೀಸ್ ಠಾಣೆ ನಿರ್ವಹಣೆಗಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಲಾದ ಸುರಕ್ಷಿತ ಇಂಟರ್ಫೇಸ್ ಆಗಿದೆ.'}
            </p>
          </div>

          {/* Column 2: Emergency */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">{language === 'en' ? 'Emergency Helpline' : 'ತುರ್ತು ಸಹಾಯವಾಣಿ'}</h3>
            <div className="space-y-2 text-xs">
              <p className="flex justify-between border-b border-slate-800 pb-1">
                <span>{language === 'en' ? 'National Emergency' : 'ರಾಷ್ಟ್ರೀಯ ತುರ್ತು ಸಂಖ್ಯೆ'}:</span>
                <strong className="text-red-500">112</strong>
              </p>
              <p className="flex justify-between border-b border-slate-800 pb-1">
                <span>{language === 'en' ? 'Cyber Cell Support' : 'ಸೈಬರ್ ಸೆಲ್ ಸಹಾಯ'}:</span>
                <strong className="text-white">1930</strong>
              </p>
              <p className="flex justify-between border-b border-slate-800 pb-1">
                <span>{language === 'en' ? 'Women Helpline' : 'ಮಹಿಳಾ ಸಹಾಯವಾಣಿ'}:</span>
                <strong className="text-white">1091</strong>
              </p>
              <p className="flex justify-between border-b border-slate-800 pb-1">
                <span>{language === 'en' ? 'Child Helpline' : 'ಮಕ್ಕಳ ಸಹಾಯವಾಣಿ'}:</span>
                <strong className="text-white">1098</strong>
              </p>
            </div>
          </div>

          {/* Column 3: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">{language === 'en' ? 'Quick Links' : 'ತ್ವರಿತ ಲಿಂಕ್‌ಗಳು'}</h3>
            <ul className="space-y-2 text-xs font-semibold">
              <li><button onClick={() => navigate('/citizen')} className="hover:text-govgold transition">{language === 'en' ? 'Register Grievances' : 'ದೂರುಗಳನ್ನು ನೋಂದಾಯಿಸಿ'}</button></li>
              <li><button onClick={() => navigate('/login')} className="hover:text-govgold transition">{language === 'en' ? 'Secure Login Terminal' : 'ಸುರಕ್ಷಿತ ಲಾಗಿನ್ ಟರ್ಮಿನಲ್'}</button></li>
              <li><button onClick={() => navigate('/government')} className="hover:text-govgold transition">{language === 'en' ? 'State Analytics Portal' : 'ರಾಜ್ಯ ವಿಶ್ಲೇಷಣೆ ಪೋರ್ಟಲ್'}</button></li>
              <li><a href="https://ksp.karnataka.gov.in" target="_blank" rel="noreferrer" className="hover:text-govgold transition">{language === 'en' ? 'Official KSP Portal' : 'ಅಧಿಕೃತ ಕೆಎಸ್ಪಿ ಪೋರ್ಟಲ್'}</a></li>
            </ul>
          </div>

          {/* Column 4: Address */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">{language === 'en' ? 'Contact Headquarters' : 'ಪ್ರಧಾನ ಕಚೇರಿ ಸಂಪರ್ಕ'}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Office of the Director General and Inspector General of Police,<br/>
              Karnataka State Police Headquarters, Nrupathunga Road,<br/>
              Bengaluru, Karnataka - 560001
            </p>
            <p className="text-xs text-slate-400">
              Email: support-kciap@ksp.gov.in
            </p>
          </div>
        </div>

        {/* Legal bar */}
        <div className="max-w-7xl mx-auto border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-500 font-semibold select-none">
          <div className="text-center md:text-left space-y-1">
            <p>© {new Date().getFullYear()} Karnataka State Police (KSP). All Rights Reserved.</p>
            <p className="text-slate-600">Designed & Maintained for Government of Karnataka / Karnataka State Police portal initiative.</p>
          </div>
          <div className="flex gap-4">
            <a href="#footer" onClick={(e) => { e.preventDefault(); alert("Policy Details: Access strictly restricted to KSP authorized personnel."); }} className="hover:underline hover:text-slate-400">Privacy Policy</a>
            <span>·</span>
            <a href="#footer" onClick={(e) => { e.preventDefault(); alert("Terms of Use: Usage of this platform is monitored under IT Act guidelines."); }} className="hover:underline hover:text-slate-400">Terms & Conditions</a>
            <span>·</span>
            <a href="#footer" onClick={(e) => { e.preventDefault(); alert("Sitemap access is restricted."); }} className="hover:underline hover:text-slate-400">Sitemap</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
