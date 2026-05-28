import { useState, useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import PauseButton from './components/PauseButton'
import GroundingOverlay from './components/GroundingOverlay'
import InstallBanner, { isBannerDismissed } from './components/InstallBanner'
import IOSInstallSheet, { isIOSSheetShown } from './components/IOSInstallSheet'
import { applyAccent } from './screens/MeScreen'
import HomeScreen from './screens/HomeScreen'
import SpaceScreen from './screens/SpaceScreen'
import SettleScreen from './screens/SettleScreen'
import MeScreen from './screens/MeScreen'
import EveningRitualScreen from './screens/EveningRitualScreen'
import FigureItOutScreen from './screens/FigureItOutScreen'
import OnboardingFlow from './onboarding/OnboardingFlow'
import db from './db/db'
import { scheduleDay } from './utils/notifications'
import { useInstallPrompt } from './hooks/useInstallPrompt'
import { isIOSSafari, isStandalone } from './utils/pwa'
import ScrollToTop from './components/ScrollToTop'

export default function App() {
  // null = still checking, false = not complete, true = complete
  const [onboardingComplete, setOnboardingComplete] = useState(null)
  const [groundingOpen,      setGroundingOpen]      = useState(false)

  // Install prompt (Android/Chrome)
  const { canInstall, promptInstall } = useInstallPrompt()
  const [showInstallBanner, setShowInstallBanner] = useState(false)

  // iOS install guide
  const [showIOSSheet, setShowIOSSheet] = useState(false)

  // Re-apply saved accent colour on every launch
  useEffect(() => {
    db.settings.where('key').equals('accent_color').first()
      .then(r => { if (r?.value) applyAccent(r.value) })
      .catch(() => {})
  }, [])

  // Schedule today's notifications on launch and on every tab focus
  useEffect(() => {
    scheduleDay().catch(() => {})
    function onVisible() {
      if (document.visibilityState === 'visible') scheduleDay().catch(() => {})
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [])

  // Show Android install banner when prompt is available
  useEffect(() => {
    if (canInstall && !isBannerDismissed()) {
      setShowInstallBanner(true)
    }
  }, [canInstall])

  useEffect(() => {
    db.settings
      .where('key').equals('onboarding_complete')
      .first()
      .then(record => setOnboardingComplete(!!record?.value))
      .catch(() => setOnboardingComplete(false))
  }, [])

  // Show iOS guide once, 1.5 s after onboarding completes
  function handleOnboardingComplete() {
    setOnboardingComplete(true)
    if (isIOSSafari() && !isStandalone() && !isIOSSheetShown()) {
      setTimeout(() => setShowIOSSheet(true), 1500)
    }
  }

  // Hold render until DB check resolves — use a styled div to avoid white flash
  if (onboardingComplete === null) return <div className="app-loading" />

  if (!onboardingComplete) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />
  }

  return (
    <>
      <Routes>
        {/* Full-screen ritual — no nav, no pause button */}
        <Route path="/evening"       element={<EveningRitualScreen />} />
        <Route path="/figure-it-out" element={<FigureItOutScreen />}  />

        {/* Main app shell with nav */}
        <Route path="*" element={
          <div className="app-shell">
            {showInstallBanner && (
              <InstallBanner
                onInstall={promptInstall}
                onDismiss={() => setShowInstallBanner(false)}
              />
            )}
            <main className="app-shell__main">
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home"   element={<HomeScreen />}   />
                <Route path="/space"  element={<SpaceScreen />}  />
                <Route path="/settle" element={<SettleScreen />} />
                <Route path="/me"     element={<MeScreen />}     />
                <Route path="*"       element={<Navigate to="/home" replace />} />
              </Routes>
            </main>
            <PauseButton onPress={() => setGroundingOpen(true)} />
            <BottomNav />
            {groundingOpen && (
              <GroundingOverlay onClose={() => setGroundingOpen(false)} />
            )}
          </div>
        } />
      </Routes>

      {/* iOS install guide — rendered outside Routes so it layers over everything */}
      {showIOSSheet && (
        <IOSInstallSheet onClose={() => setShowIOSSheet(false)} />
      )}
    </>
  )
}
