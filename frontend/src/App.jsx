import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useState } from 'react'
import OfficialHeader from './components/OfficialHeader'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import CitizenLoginPage from './pages/CitizenLoginPage'
import OfficerLoginPage from './pages/OfficerLoginPage'
import GovernmentLoginPage from './pages/GovernmentLoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'

// Citizen Portal Subpages
import CitizenLayout from './pages/citizen/CitizenLayout'
import CitizenDashboard from './pages/citizen/CitizenDashboard'
import ReportCrime from './pages/citizen/ReportCrime'
import TrackComplaint from './pages/citizen/TrackComplaint'
import CrimeAwareness from './pages/citizen/CrimeAwareness'
import EmergencyServices from './pages/citizen/EmergencyServices'
import PublicCrimeMap from './pages/citizen/PublicCrimeMap'
import CitizenAiAssistant from './pages/citizen/CitizenAiAssistant'
import CitizenSettings from './pages/citizen/CitizenSettings'

// Officer Portal Subpages
import OfficerLayout from './pages/officer/OfficerLayout'
import OfficerDashboard from './pages/officer/OfficerDashboard'
import FirManagement from './pages/officer/FirManagement'
import CaseManagement from './pages/officer/CaseManagement'
import OfficerCrimeMapping from './pages/officer/OfficerCrimeMapping'
import OfficerHotspots from './pages/officer/OfficerHotspots'
import OfficerNetworkAnalysis from './pages/officer/OfficerNetworkAnalysis'
import OfficerSuspectSearch from './pages/officer/OfficerSuspectSearch'
import OfficerAiInvestigator from './pages/officer/OfficerAiInvestigator'
import RepeatOffenders from './pages/officer/RepeatOffenders'
import ReportGenerator from './pages/officer/ReportGenerator'
import OfficerProfile from './pages/officer/OfficerProfile'
import OfficerNotifications from './pages/officer/OfficerNotifications'

// Government Portal Subpages
import GovernmentLayout from './pages/government/GovernmentLayout'
import GovernmentDashboard from './pages/government/GovernmentDashboard'
import GovernmentStateCrimeMap from './pages/government/GovernmentStateCrimeMap'
import GovernmentDistrictAnalytics from './pages/government/GovernmentDistrictAnalytics'
import GovernmentResourceAllocation from './pages/government/GovernmentResourceAllocation'
import GovernmentPredictiveAnalytics from './pages/government/GovernmentPredictiveAnalytics'
import GovernmentReports from './pages/government/GovernmentReports'
import GovernmentAiStrategicAdvisor from './pages/government/GovernmentAiStrategicAdvisor'

function AppContent() {
  const [language, setLanguage] = useState('en')
  const [fontSize, setFontSize] = useState('A')
  const location = useLocation()

  // Full-screen pages without the main Karnataka header layout
  const isAuthPage = location.pathname.startsWith('/login') || ['/register', '/forgot-password'].includes(location.pathname)

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/citizen" element={<CitizenLoginPage />} />
        <Route path="/login/officer" element={<OfficerLoginPage />} />
        <Route path="/login/government" element={<GovernmentLoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Routes>
    )
  }

  return (
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
          
          {/* Citizen nested routes */}
          <Route path="/citizen/*" element={
            <ProtectedRoute allowedRoles={['Citizen']}>
              <CitizenLayout />
            </ProtectedRoute>
          }>
            <Route index element={<CitizenDashboard />} />
            <Route path="report" element={<ReportCrime />} />
            <Route path="track" element={<TrackComplaint />} />
            <Route path="awareness" element={<CrimeAwareness />} />
            <Route path="emergency" element={<EmergencyServices />} />
            <Route path="map" element={<PublicCrimeMap />} />
            <Route path="ai" element={<CitizenAiAssistant />} />
            <Route path="settings" element={<CitizenSettings />} />
          </Route>

          {/* Police Officer nested routes */}
          <Route path="/officer/*" element={
            <ProtectedRoute allowedRoles={['Police Officer']}>
              <OfficerLayout />
            </ProtectedRoute>
          }>
            <Route index element={<OfficerDashboard />} />
            <Route path="fir" element={<FirManagement />} />
            <Route path="cases" element={<CaseManagement />} />
            <Route path="map" element={<OfficerCrimeMapping />} />
            <Route path="hotspots" element={<OfficerHotspots />} />
            <Route path="network" element={<OfficerNetworkAnalysis />} />
            <Route path="search" element={<OfficerSuspectSearch />} />
            <Route path="ai" element={<OfficerAiInvestigator />} />
            <Route path="offenders" element={<RepeatOffenders />} />
            <Route path="reports" element={<ReportGenerator />} />
            <Route path="profile" element={<OfficerProfile />} />
            <Route path="notifications" element={<OfficerNotifications />} />
          </Route>

          {/* Government Official nested routes */}
          <Route path="/government/*" element={
            <ProtectedRoute allowedRoles={['Government Official']}>
              <GovernmentLayout />
            </ProtectedRoute>
          }>
            <Route index element={<GovernmentDashboard />} />
            <Route path="map" element={<GovernmentStateCrimeMap />} />
            <Route path="analytics" element={<GovernmentDistrictAnalytics />} />
            <Route path="resources" element={<GovernmentResourceAllocation />} />
            <Route path="predictive" element={<GovernmentPredictiveAnalytics />} />
            <Route path="reports" element={<GovernmentReports />} />
            <Route path="ai" element={<GovernmentAiStrategicAdvisor />} />
          </Route>

          {/* Fallback route checks */}
          <Route path="/citizen-dashboard" element={<Navigate to="/citizen" replace />} />
          <Route path="/officer-dashboard" element={<Navigate to="/officer" replace />} />
          <Route path="/government-dashboard" element={<Navigate to="/government" replace />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <div className="py-12 text-center text-xs font-semibold uppercase tracking-widest text-slate-500">Redirecting to designated workspace...</div>
            </ProtectedRoute>
          } />

          <Route path="/ai" element={
            <ProtectedRoute allowedRoles={['Citizen']}>
              <CitizenAiAssistant />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
