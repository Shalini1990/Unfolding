import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import db from '../db/db'
import { applyTheme } from '../hooks/useTheme'
import { ALL_FEATURES } from '../context/FeaturesContext'
import Step1Welcome from './Step1Welcome'
import Step2Privacy from './Step2Privacy'
import Step3Theme from './Step3Theme'
import Step4NorthStar from './Step4NorthStar'
import Step5Notifications from './Step5Notifications'
import Step6Features from './Step6Features'
import Step7Ready from './Step6Ready'

async function upsertSetting(key, value) {
  const existing = await db.settings.where('key').equals(key).first()
  if (existing) {
    await db.settings.update(existing.id, { value })
  } else {
    await db.settings.add({ key, value })
  }
}

export default function OnboardingFlow({ onComplete }) {
  const [step, setStep] = useState(1)
  const [theme, setTheme] = useState('minimal')
  const [northStar, setNorthStar] = useState('')
  const [morningTime, setMorningTime] = useState('08:00')
  const [eveningTime, setEveningTime] = useState('20:00')
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [features, setFeatures] = useState(ALL_FEATURES)

  const next = () => setStep(s => s + 1)

  function handleThemeSelect(t) {
    setTheme(t)
    applyTheme(t)
  }

  function handleToggleFeature(id) {
    setFeatures(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  async function handleComplete() {
    await upsertSetting('theme', theme)
    await upsertSetting('onboarding_complete', true)
    await upsertSetting('install_date', new Date().toISOString())
    await upsertSetting('onboarding_day', 1)
    await upsertSetting('features_enabled', JSON.stringify(features))

    if (notificationsEnabled) {
      await upsertSetting('notifications_enabled', true)
      await upsertSetting('notification_morning', morningTime)
      await upsertSetting('notification_evening', eveningTime)
    }

    if (northStar.trim()) {
      await db.north_star.put({ id: 1, text: northStar.trim() })
    }

    onComplete()
  }

  const shared = {
    theme,
    northStar, setNorthStar,
    morningTime, setMorningTime,
    eveningTime, setEveningTime,
    notificationsEnabled, setNotificationsEnabled,
    features, onToggleFeature: handleToggleFeature,
    onThemeSelect: handleThemeSelect,
    onComplete: handleComplete,
    next,
  }

  const STEPS = [
    Step1Welcome,
    Step2Privacy,
    Step3Theme,
    Step4NorthStar,
    Step5Notifications,
    Step6Features,
    Step7Ready,
  ]

  const StepComponent = STEPS[step - 1]

  // Show back on steps 2–6 (not Welcome or Ready)
  const showBack = step > 1 && step < 7

  return (
    <div className="onboarding">
      {showBack && (
        <button
          className="ob-back"
          onClick={() => setStep(s => s - 1)}
          type="button"
          aria-label="Back"
        >
          <ChevronLeft size={20} strokeWidth={2} />
        </button>
      )}
      {/* key forces remount on step change, triggering the entrance animation */}
      <div key={step} className="ob-step">
        <StepComponent {...shared} />
      </div>
    </div>
  )
}
