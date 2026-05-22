export default function Step5Notifications({
  morningTime, setMorningTime,
  eveningTime, setEveningTime,
  setNotificationsEnabled,
  next,
}) {
  async function handleSetReminders() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      setNotificationsEnabled(permission === 'granted')
    }
    next()
  }

  return (
    <div className="ob-screen">
      <div className="ob-content">
        <h2 className="ob-title">Stay in your rhythm.</h2>
        <p className="ob-subtitle">
          Set gentle reminders for your morning and evening rituals.
        </p>

        <div className="ob-time-pickers">
          <label className="ob-time-label">
            <span>Morning ritual</span>
            <input
              type="time"
              className="ob-time-input"
              value={morningTime}
              onChange={e => setMorningTime(e.target.value)}
            />
          </label>
          <label className="ob-time-label">
            <span>Evening ritual</span>
            <input
              type="time"
              className="ob-time-input"
              value={eveningTime}
              onChange={e => setEveningTime(e.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="ob-footer">
        <button className="ob-cta" onClick={handleSetReminders} type="button">
          Set reminders
        </button>
        <button className="ob-skip" onClick={next} type="button">
          I'll set this up later
        </button>
      </div>
    </div>
  )
}
