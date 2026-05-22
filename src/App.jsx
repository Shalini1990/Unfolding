import { useState, useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import PauseButton from './components/PauseButton'
import HomeScreen from './screens/HomeScreen'
import SpaceScreen from './screens/SpaceScreen'
import SettleScreen from './screens/SettleScreen'
import MeScreen from './screens/MeScreen'
import OnboardingFlow from './onboarding/OnboardingFlow'
import db from './db/db'

export default function App() {
  // null = still checking, false = not complete, true = complete
  const [onboardingComplete, setOnboardingComplete] = useState(null)

  useEffect(() => {
    db.settings
      .where('key').equals('onboarding_complete')
      .first()
      .then(record => setOnboardingComplete(!!record?.value))
      .catch(() => setOnboardingComplete(false))
  }, [])

  // Hold render until the single DB read resolves — imperceptibly fast
  if (onboardingComplete === null) return null

  if (!onboardingComplete) {
    return <OnboardingFlow onComplete={() => setOnboardingComplete(true)} />
  }

  return (
    <div className="app-shell">
      <main className="app-shell__main">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home"   element={<HomeScreen />}   />
          <Route path="/space"  element={<SpaceScreen />}  />
          <Route path="/settle" element={<SettleScreen />} />
          <Route path="/me"     element={<MeScreen />}     />
        </Routes>
      </main>

      <PauseButton />
      <BottomNav />
    </div>
  )
}
