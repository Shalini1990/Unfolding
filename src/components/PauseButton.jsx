// ── Cairn icon (stacked stones — grounding) ─────────────────────
function CairnIcon({ size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <ellipse cx="12" cy="19" rx="8" ry="2.2" />
      <ellipse cx="12" cy="14" rx="5.5" ry="1.8" />
      <ellipse cx="12" cy="9.2" rx="3.2" ry="1.4" />
      <circle cx="12" cy="5.2" r="1.1" fill="currentColor" />
    </svg>
  )
}

// Floating pause button — always visible above the bottom nav.
// onPress opens the 3-2-1 grounding overlay (F12).
export default function PauseButton({ onPress }) {
  return (
    <button
      className="pause-button"
      onClick={onPress}
      aria-label="Pause — tap to begin 3-2-1 grounding"
      type="button"
    >
      <CairnIcon size={24} />
    </button>
  )
}
