import { useNavigate } from 'react-router-dom'
import { Moon } from 'lucide-react'
import { SleepyCharacter } from '../components/DoneCharacter'

export default function EveningPromptCard({ done }) {
  const navigate = useNavigate()

  if (done) {
    return (
      <button
        className="evening-card evening-card--done"
        onClick={() => navigate('/evening')}
        type="button"
      >
        <p className="evening-card__done">Evening reflection saved ✓ · tap to edit</p>
        <SleepyCharacter />
      </button>
    )
  }

  return (
    <button
      className="evening-card"
      onClick={() => navigate('/evening')}
      type="button"
    >
      <div className="evening-card__inner">
        <div className="evening-card__icon">
          <Moon size={18} strokeWidth={1.6} aria-hidden="true" />
        </div>
        <div>
          <p className="evening-card__label">How was your day?</p>
          <p className="evening-card__sub">Tap to reflect</p>
        </div>
      </div>
    </button>
  )
}
