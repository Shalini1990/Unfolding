/**
 * Three celebration poses for the playful theme.
 * Hidden in minimal via CSS — no JS theme check needed.
 *
 * Pose 1 — FistPump   : Three Things all ticked
 * Pose 2 — TaDa       : Spark done
 * Pose 3 — Sleepy     : Evening reflection saved
 */

// Shared head + body parts
function Head({ cx = 28, cy = 20 }) {
  return <circle cx={cx} cy={cy} r="16" fill="var(--color-accent)" />
}

// ── Pose 1: Fist Pump ───────────────────────────────────────────
export function FistPumpCharacter() {
  return (
    <svg
      viewBox="0 0 64 80"
      fill="none"
      className="done-character"
      aria-hidden="true"
    >
      {/* Sparkle dots */}
      <circle cx="6"  cy="10" r="3"   fill="var(--color-accent)" opacity="0.35" />
      <circle cx="14" cy="4"  r="2"   fill="var(--color-accent)" opacity="0.25" />
      <circle cx="3"  cy="20" r="1.5" fill="var(--color-accent)" opacity="0.2"  />

      {/* Head */}
      <Head cx="30" cy="22" />

      {/* Happy squint eyes */}
      <path d="M22 19 Q25 16 28 19" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M32 19 Q35 16 38 19" stroke="white" strokeWidth="2.5" strokeLinecap="round" />

      {/* Big grin */}
      <path d="M21 27 Q30 35 39 27" stroke="white" strokeWidth="2.5" strokeLinecap="round" />

      {/* Body */}
      <ellipse cx="30" cy="54" rx="11" ry="13" fill="var(--color-accent)" opacity="0.7" />

      {/* Left arm — relaxed */}
      <path d="M20 50 Q12 55 10 63" stroke="var(--color-accent)" strokeWidth="5" strokeLinecap="round" opacity="0.65" />

      {/* Right arm — raised fist pump */}
      <path d="M40 48 Q50 36 54 22" stroke="var(--color-accent)" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
      <circle cx="54" cy="19" r="5.5" fill="var(--color-accent)" opacity="0.9" />

      {/* Legs */}
      <path d="M23 66 L19 78" stroke="var(--color-accent)" strokeWidth="5" strokeLinecap="round" opacity="0.65" />
      <path d="M37 66 L41 78" stroke="var(--color-accent)" strokeWidth="5" strokeLinecap="round" opacity="0.65" />
    </svg>
  )
}

// ── Pose 2: Ta-Da (arms wide) ───────────────────────────────────
export function TaDaCharacter() {
  return (
    <svg
      viewBox="0 0 72 80"
      fill="none"
      className="done-character"
      aria-hidden="true"
    >
      {/* Lightning spark near right hand */}
      <path
        d="M62 32 L58 40 L63 40 L59 50"
        stroke="var(--color-accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      />

      {/* Head */}
      <Head cx="36" cy="22" />

      {/* Wide open eyes */}
      <circle cx="29" cy="20" r="3"   fill="white" />
      <circle cx="43" cy="20" r="3"   fill="white" />
      <circle cx="30" cy="21" r="1.5" fill="var(--color-accent)" />
      <circle cx="44" cy="21" r="1.5" fill="var(--color-accent)" />

      {/* Big smile */}
      <path d="M27 28 Q36 37 45 28" stroke="white" strokeWidth="2.5" strokeLinecap="round" />

      {/* Body */}
      <ellipse cx="36" cy="54" rx="11" ry="13" fill="var(--color-accent)" opacity="0.7" />

      {/* Arms — spread wide ta-da! */}
      <path d="M26 50 Q14 45 8 40" stroke="var(--color-accent)" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
      <path d="M46 50 Q58 45 62 40" stroke="var(--color-accent)" strokeWidth="5" strokeLinecap="round" opacity="0.7" />

      {/* Legs */}
      <path d="M29 66 L25 78" stroke="var(--color-accent)" strokeWidth="5" strokeLinecap="round" opacity="0.65" />
      <path d="M43 66 L47 78" stroke="var(--color-accent)" strokeWidth="5" strokeLinecap="round" opacity="0.65" />
    </svg>
  )
}

// ── Pose 3: Sleepy ──────────────────────────────────────────────
export function SleepyCharacter() {
  return (
    <svg
      viewBox="0 0 64 80"
      fill="none"
      className="done-character"
      aria-hidden="true"
    >
      {/* Crescent moon */}
      <path
        d="M50 6 Q60 13 50 20 Q57 13 50 6Z"
        fill="var(--color-accent)"
        opacity="0.45"
      />

      {/* Floating z's */}
      <text x="42" y="18" fontFamily="sans-serif" fontSize="9" fill="var(--color-accent)" opacity="0.5">z</text>
      <text x="48" y="12" fontFamily="sans-serif" fontSize="7" fill="var(--color-accent)" opacity="0.35">z</text>

      {/* Head */}
      <Head cx="28" cy="22" />

      {/* Closed sleepy eyes (downward arcs) */}
      <path d="M20 20 Q23 23 26 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M30 20 Q33 23 36 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" />

      {/* Gentle peaceful smile */}
      <path d="M22 27 Q28 32 34 27" stroke="white" strokeWidth="2" strokeLinecap="round" />

      {/* Body */}
      <ellipse cx="28" cy="54" rx="11" ry="13" fill="var(--color-accent)" opacity="0.65" />

      {/* Both arms relaxed down */}
      <path d="M18 50 Q10 54 8 62" stroke="var(--color-accent)" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
      <path d="M38 50 Q46 54 48 62" stroke="var(--color-accent)" strokeWidth="5" strokeLinecap="round" opacity="0.6" />

      {/* Legs */}
      <path d="M22 66 L18 78" stroke="var(--color-accent)" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
      <path d="M34 66 L38 78" stroke="var(--color-accent)" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
    </svg>
  )
}
