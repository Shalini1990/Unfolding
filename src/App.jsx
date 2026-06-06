import { useState, useEffect, useCallback } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import FeaturesContext, { ALL_FEATURES } from './context/FeaturesContext'
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
import Tour, { shouldShowTour, TOUR_KEY } from './components/Tour'

export default function App() {
  // null = still checking, false = not complete, true = complete
  const [onboardingComplete, setOnboardingComplete] = useState(null)
  const [groundingOpen,      setGroundingOpen]      = useState(false)
  const [features,           setFeatures]           = useState(ALL_FEATURES)
  const [tourActive,         setTourActive]         = useState(false)
  const navigate = useNavigate()

  const loadFeatures = useCallback(async () => {
    try {
      const rec = await db.settings.where('key').equals('features_enabled').first()
      if (rec?.value) {
        const stored = JSON.parse(rec.value)
        // Migration: old feature lists include 'evening' (now removed).
        // When detected, strip 'evening' and add any new default features so
        // existing users automatically get grounding, kind_words, etc.
        if (stored.includes('evening')) {
          const cleaned  = stored.filter(f => f !== 'evening')
          const newOnes  = ALL_FEATURES.filter(f => !cleaned.includes(f))
          const migrated = [...cleaned, ...newOnes]
          await db.settings.update(rec.id, { value: JSON.stringify(migrated) })
          setFeatures(migrated)
        } else {
          setFeatures(stored)
        }
      } else {
        setFeatures(ALL_FEATURES)
      }
    } catch { setFeatures(ALL_FEATURES) }
  }, [])

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

  useEffect(() => { loadFeatures() }, [loadFeatures])

  // After onboarding, reload features and start the tour
  function handleOnboardingComplete() {
    setOnboardingComplete(true)
    loadFeatures()
    navigate('/home', { replace: true })
    // Start the feature tour (slight delay so the home screen mounts first)
    setTimeout(() => setTourActive(true), 300)
    if (isIOSSafari() && !isStandalone() && !isIOSSheetShown()) {
      setTimeout(() => setShowIOSSheet(true), 1500)
    }
  }

  // On subsequent launches: check if tour was dismissed already
  useEffect(() => {
    if (onboardingComplete === true && shouldShowTour()) {
      setTimeout(() => setTourActive(true), 500)
    }
  }, [onboardingComplete])

  // Hold render until DB check resolves — use a styled div to avoid white flash
  if (onboardingComplete === null) return <div className="app-loading" />

  if (!onboardingComplete) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />
  }

  return (
    <FeaturesContext.Provider value={{ features, refresh: loadFeatures }}>
    <>
      <Routes>
        {/* Full-screen ritual — no nav, no pause button */}
        <Route path="/evening"       element={<EveningRitualScreen />} />
        <Route path="/figure-it-out" element={
          features.includes('figure_it_out')
            ? <FigureItOutScreen />
            : <Navigate to="/home" replace />
        } />

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
                <Route path="/space"  element={
                  features.includes('space')
                    ? <SpaceScreen />
                    : <Navigate to="/home" replace />
                } />
                <Route path="/settle" element={
                  features.includes('settle')
                    ? <SettleScreen />
                    : <Navigate to="/home" replace />
                } />
                <Route path="/me"     element={<MeScreen />}     />
                <Route path="*"       element={<Navigate to="/home" replace />} />
              </Routes>
            </main>
            {features.includes('grounding') && (
              <PauseButton onPress={() => setGroundingOpen(true)} />
            )}
            <BottomNav />
            {groundingOpen && features.includes('grounding') && (
              <GroundingOverlay onClose={() => setGroundingOpen(false)} />
            )}
          </div>
        } />
      </Routes>

      {/* Feature tour — rendered outside Routes so it layers over the whole shell */}
      {tourActive && (
        <Tour features={features} onDone={() => setTourActive(false)} />
      )}

      {/* iOS install guide — rendered outside Routes so it layers over everything */}
      {showIOSSheet && (
        <IOSInstallSheet onClose={() => setShowIOSSheet(false)} />
      )}
    </>
    </FeaturesContext.Provider>
  )
}
