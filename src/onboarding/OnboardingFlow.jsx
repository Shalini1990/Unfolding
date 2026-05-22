import { useState } from 'react'
import db from '../db/db'
import { applyTheme } from '../hooks/useTheme'
import Step1Welcome from './Step1Welcome'
import Step2Privacy from './Step2Privacy'
import Step3Theme from './Step3Theme'
import Step4NorthStar from './Step4NorthStar'
import Step5Notifications from './Step5Notifications'
import Step6Ready from './Step6Ready'

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

  const next = () => setStep(s => s + 1)

  function handleThemeSelect(t) {
    setTheme(t)
    applyTheme(t)
  }

  async function handleComplete() {
    await upsertSetting('theme', theme)
    await upsertSetting('onboarding_complete', true)
    await upsertSetting('install_date', new Date().toISOString())
    await upsertSetting('onboarding_day', 1)

    if (notificationsEnabled) {
      await upsertSetting('notifications_enabled', true)
      await upsertSetting('notification_morning', morningTime)
      await upsertSetting('notification_evening', eveningTime)
    }

    if (northStar.trim()) {
      // north_star is a single-record table — put with id 1 upserts it
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
    Step6Ready,
  ]

  const StepComponent = STEPS[step - 1]

  return (
    <div className="onboarding">
      {/* key forces remount on step change, triggering the entrance animation */}
      <div key={step} className="ob-step">
        <StepComponent {...shared} />
      </div>
    </div>
  )
}
