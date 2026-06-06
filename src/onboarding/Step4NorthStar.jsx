export default function Step4NorthStar({ northStar, setNorthStar, next }) {
  const hasContent = northStar.trim().length > 0

  return (
    <div className="ob-screen">
      <div className="ob-content">
        <h2 className="ob-title">What do you want to come back to, every day?</h2>
        <p className="ob-subtitle">
          A goal, a reminder, or an anchor. Just one line you want to carry with you every day.
        </p>
        <textarea
          className="ob-textarea"
          value={northStar}
          onChange={e => setNorthStar(e.target.value)}
          placeholder="e.g. Being present for my family while building something I believe in"
          rows={4}
          autoFocus
        />
      </div>

      <div className="ob-footer">
        <button className="ob-cta" onClick={next} type="button">
          {hasContent ? 'Save' : 'Continue'}
        </button>
        <button className="ob-skip" onClick={next} type="button">
          You can always add this later
        </button>
      </div>
    </div>
  )
}
