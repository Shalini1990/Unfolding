import { Wind } from 'lucide-react'

// Floating pause button — always visible above the bottom nav.
// Will trigger the 3-2-1 grounding sequence in a future session.
export default function PauseButton() {
  function handlePress() {
    console.log('Pause tapped')
  }

  return (
    <button
      className="pause-button"
      onClick={handlePress}
      aria-label="Pause — tap to begin 3-2-1 grounding"
      type="button"
    >
      <Wind size={18} strokeWidth={1.75} aria-hidden="true" />
    </button>
  )
}
