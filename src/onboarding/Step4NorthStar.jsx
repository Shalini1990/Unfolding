export default function Step4NorthStar({ northStar, setNorthStar, next }) {
  const hasContent = northStar.trim().length > 0

  return (
    <div className="ob-screen">
      <div className="ob-content">
        <h2 className="ob-title">What matters most to you right now?</h2>
        <p className="ob-subtitle">
          This will quietly guide the app. One sentence is enough.
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
