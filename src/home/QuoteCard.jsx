import { useState } from 'react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'

export default function QuoteCard({ quoteState, dayNumber, onThumb }) {
  const tapToReveal = dayNumber > 7
  const [revealed, setRevealed] = useState(!tapToReveal)

  if (!quoteState?.today_quote) return null

  const thumb = quoteState.today_thumb

  function handleCardClick() {
    if (tapToReveal && !revealed) setRevealed(true)
  }

  function handleThumb(e, dir) {
    e.stopPropagation()
    onThumb(thumb === dir ? null : dir)
  }

  const thumbsVisible = !tapToReveal || revealed

  return (
    <div
      className={`quote-card${tapToReveal && !revealed ? ' quote-card--tapable' : ''}`}
      onClick={handleCardClick}
      role={tapToReveal && !revealed ? 'button' : undefined}
      aria-label={tapToReveal && !revealed ? 'Tap to reveal options' : undefined}
    >
      <p className="quote-card__text">{quoteState.today_quote}</p>
      {thumbsVisible && (
        <div className="quote-card__thumbs">
          <button
            className={`quote-thumb${thumb === 'up' ? ' quote-thumb--up' : ''}`}
            onClick={e => handleThumb(e, 'up')}
            type="button"
            aria-label="Like this quote"
          >
            <ThumbsUp size={14} strokeWidth={2} />
            {!tapToReveal && <span className="quote-thumb__label">like</span>}
          </button>
          <button
            className={`quote-thumb${thumb === 'down' ? ' quote-thumb--down' : ''}`}
            onClick={e => handleThumb(e, 'down')}
            type="button"
            aria-label="Not for me"
          >
            <ThumbsDown size={14} strokeWidth={2} />
            {!tapToReveal && <span className="quote-thumb__label">not for me</span>}
          </button>
        </div>
      )}
    </div>
  )
}
