export default function TomorrowCard({ text, dateSet }) {
  if (!text) return null

  // If the intention was set today it's genuinely for tomorrow;
  // once midnight passes and it becomes that day, switch to "today".
  const today = new Date().toISOString().split('T')[0]
  const label = dateSet === today
    ? 'Looking forward to tomorrow'
    : 'Looking forward to today'

  return (
    <div className="tomorrow-card">
      <p className="tomorrow-card__eyebrow">{label}</p>
      <p className="tomorrow-card__text">{text}</p>
    </div>
  )
}
