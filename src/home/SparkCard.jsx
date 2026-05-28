import { Zap, RefreshCw } from 'lucide-react'
import { TaDaCharacter } from '../components/DoneCharacter'

const TYPE_LABELS = {
  novelty:  'Novelty',
  creative: 'Creative',
  mastery:  'Mastery',
  social:   'Social',
  sensory:  'Sensory',
}

export default function SparkCard({ spark, animationKey, onDone, onSkip, onShuffle }) {
  if (!spark) return null

  if (spark.completion_status === 'skipped') return null

  if (spark.completion_status === 'done') {
    return (
      <div className="spark-card spark-card--done">
        <p className="spark-card__text">{spark.task_text}</p>
        <p className="spark-card__done-text">Spark done ✓</p>
        <TaDaCharacter />
      </div>
    )
  }

  return (
    <div className="spark-card">
      <div className="spark-card__header">
        <p className="spark-card__eyebrow">
          <Zap size={11} strokeWidth={2.5} aria-hidden="true" />
          Today's Spark · {TYPE_LABELS[spark.type] ?? 'Spark'}
        </p>
        <button
          className="spark-card__shuffle"
          onClick={onShuffle}
          type="button"
          aria-label="Get a different spark"
        >
          <RefreshCw size={14} strokeWidth={2} />
        </button>
      </div>
      <p className="spark-card__text" key={animationKey}>
        {spark.task_text}
      </p>
      <div className="spark-card__actions">
        <button className="spark-card__btn-done" onClick={onDone} type="button">
          Done
        </button>
        <button className="spark-card__btn-skip" onClick={onSkip} type="button">
          Not today
        </button>
      </div>
    </div>
  )
}
