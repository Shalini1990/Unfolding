/**
 * Cartoon characters for the playful theme.
 * All hidden in minimal via CSS — no JS theme check needed.
 *
 * Celebration poses (done-character class — appear on completion):
 *   FistPump   : Three Things all ticked
 *   TaDa       : Spark done
 *   Sleepy     : Evening reflection saved
 *
 * Ambient poses (ambient-character class — always visible in playful):
 *   Waving     : Greeting header
 *   Thinking   : Three Things input mode (while writing)
 *   Stargazing : North Star line
 *   Curious    : Spark card (pending — encouraging you to try it)
 */

// ── Pose 1: Fist Pump ───────────────────────────────────────────
export function FistPumpCharacter() {
  return (
    <svg viewBox="0 0 64 80" fill="none" className="done-character" aria-hidden="true">
      {/* Sparkle dots */}
      <circle cx="6"  cy="10" r="3"   fill="var(--color-accent)" opacity="0.35" />
      <circle cx="14" cy="4"  r="2"   fill="var(--color-accent)" opacity="0.25" />
      <circle cx="3"  cy="20" r="1.5" fill="var(--color-accent)" opacity="0.2"  />

      {/* Head */}
      <circle cx="30" cy="22" r="16" fill="var(--color-accent)" />

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
    <svg viewBox="0 0 72 80" fill="none" className="done-character" aria-hidden="true">
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
      <circle cx="36" cy="22" r="16" fill="var(--color-accent)" />

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
    <svg viewBox="0 0 64 80" fill="none" className="done-character" aria-hidden="true">
      {/* Crescent moon */}
      <path d="M50 6 Q60 13 50 20 Q57 13 50 6Z" fill="var(--color-accent)" opacity="0.45" />

      {/* Floating z's */}
      <text x="42" y="18" fontFamily="sans-serif" fontSize="9" fill="var(--color-accent)" opacity="0.5">z</text>
      <text x="48" y="12" fontFamily="sans-serif" fontSize="7" fill="var(--color-accent)" opacity="0.35">z</text>

      {/* Head */}
      <circle cx="28" cy="22" r="16" fill="var(--color-accent)" />

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

// ── Ambient 1: Waving ───────────────────────────────────────────
// Greeting header — friendly wave to start the day
export function WavingCharacter() {
  return (
    <svg viewBox="0 0 56 72" fill="none" className="ambient-character ambient-character--wave" aria-hidden="true">
      {/* Sparkles near raised hand */}
      <circle cx="46" cy="4"  r="2.5" fill="var(--color-accent)" opacity="0.4"  />
      <circle cx="52" cy="12" r="1.5" fill="var(--color-accent)" opacity="0.3"  />
      <circle cx="42" cy="2"  r="1.5" fill="var(--color-accent)" opacity="0.25" />

      {/* Head */}
      <circle cx="24" cy="20" r="15" fill="var(--color-accent)" />

      {/* Friendly open eyes with pupils */}
      <circle cx="18" cy="18" r="3"   fill="white" />
      <circle cx="30" cy="18" r="3"   fill="white" />
      <circle cx="19" cy="19" r="1.5" fill="var(--color-accent)" />
      <circle cx="31" cy="19" r="1.5" fill="var(--color-accent)" />

      {/* Big wide smile */}
      <path d="M17 26 Q24 33 31 26" stroke="white" strokeWidth="2.5" strokeLinecap="round" />

      {/* Body */}
      <ellipse cx="24" cy="50" rx="10" ry="12" fill="var(--color-accent)" opacity="0.7" />

      {/* Left arm — relaxed */}
      <path d="M15 46 Q7 51 5 58" stroke="var(--color-accent)" strokeWidth="4.5" strokeLinecap="round" opacity="0.65" />

      {/* Right arm — raised high, waving */}
      <path d="M33 44 Q44 32 48 18" stroke="var(--color-accent)" strokeWidth="4.5" strokeLinecap="round" opacity="0.8" />
      <circle cx="49" cy="14" r="5" fill="var(--color-accent)" opacity="0.9" />

      {/* Legs */}
      <path d="M18 61 L15 71" stroke="var(--color-accent)" strokeWidth="4.5" strokeLinecap="round" opacity="0.65" />
      <path d="M30 61 L33 71" stroke="var(--color-accent)" strokeWidth="4.5" strokeLinecap="round" opacity="0.65" />
    </svg>
  )
}

// ── Ambient 2: Thinking ─────────────────────────────────────────
// Three Things input mode — sits top-right while you write intentions
export function ThinkingCharacter() {
  return (
    <svg viewBox="0 0 64 80" fill="none" className="ambient-character ambient-character--think" aria-hidden="true">
      {/* Ascending thought bubbles */}
      <circle cx="46" cy="16" r="1.5" fill="var(--color-accent)" opacity="0.3"  />
      <circle cx="51" cy="10" r="2"   fill="var(--color-accent)" opacity="0.25" />
      <circle cx="57" cy="5"  r="2.5" fill="var(--color-accent)" opacity="0.2"  />

      {/* Head */}
      <circle cx="28" cy="22" r="15" fill="var(--color-accent)" />

      {/* Left eye — squinting (thinking) */}
      <path d="M19 20 Q22 17 25 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" />

      {/* Right eye — open, curious */}
      <circle cx="34" cy="19" r="3"   fill="white" />
      <circle cx="35" cy="20" r="1.5" fill="var(--color-accent)" />

      {/* Hmm mouth — a slight thoughtful curve */}
      <path d="M22 29 Q28 32 34 29" stroke="white" strokeWidth="2" strokeLinecap="round" />

      {/* Body */}
      <ellipse cx="28" cy="52" rx="11" ry="13" fill="var(--color-accent)" opacity="0.7" />

      {/* Right arm raised — hand near chin, thinking */}
      <path d="M38 46 Q48 40 51 30" stroke="var(--color-accent)" strokeWidth="5" strokeLinecap="round" opacity="0.75" />
      <circle cx="51" cy="27" r="4.5" fill="var(--color-accent)" opacity="0.85" />

      {/* Left arm — relaxed down */}
      <path d="M18 48 Q10 54 8 62" stroke="var(--color-accent)" strokeWidth="5" strokeLinecap="round" opacity="0.6" />

      {/* Legs */}
      <path d="M21 64 L17 76" stroke="var(--color-accent)" strokeWidth="5" strokeLinecap="round" opacity="0.65" />
      <path d="M35 64 L39 76" stroke="var(--color-accent)" strokeWidth="5" strokeLinecap="round" opacity="0.65" />
    </svg>
  )
}

// ── Ambient 3: Stargazing ───────────────────────────────────────
// North Star line — looking up at the star with wonder
export function StargazingCharacter() {
  return (
    <svg viewBox="0 0 56 68" fill="none" className="ambient-character ambient-character--star" aria-hidden="true">
      {/* Star above */}
      <path
        d="M28 2 L30 9 L37 9 L32 13 L34 20 L28 16 L22 20 L24 13 L19 9 L26 9 Z"
        fill="var(--color-accent)"
        opacity="0.65"
      />

      {/* Head — positioned lower, tilted upward */}
      <circle cx="28" cy="34" r="13" fill="var(--color-accent)" />

      {/* Eyes looking up — upward crescent arcs */}
      <path d="M21 32 Q24 28 27 32" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M29 32 Q32 28 35 32" stroke="white" strokeWidth="2.5" strokeLinecap="round" />

      {/* Open "wow" mouth */}
      <circle cx="28" cy="40" r="2.5" fill="white" opacity="0.85" />

      {/* Body */}
      <ellipse cx="28" cy="56" rx="10" ry="10" fill="var(--color-accent)" opacity="0.65" />

      {/* Arms — raised slightly, wondering */}
      <path d="M19 52 Q11 48 8 42" stroke="var(--color-accent)" strokeWidth="4" strokeLinecap="round" opacity="0.65" />
      <path d="M37 52 Q45 48 48 42" stroke="var(--color-accent)" strokeWidth="4" strokeLinecap="round" opacity="0.65" />

      {/* Short legs */}
      <path d="M22 65 L19 68" stroke="var(--color-accent)" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
      <path d="M34 65 L37 68" stroke="var(--color-accent)" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
    </svg>
  )
}

// ── Ambient 4: Curious ──────────────────────────────────────────
// Spark card (pending) — leaning in, excited to try something new
export function CuriousCharacter() {
  return (
    <svg viewBox="0 0 64 80" fill="none" className="ambient-character ambient-character--curious" aria-hidden="true">
      {/* Zap near the character — spark energy */}
      <path
        d="M52 12 L48 21 L54 21 L50 32"
        stroke="var(--color-accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      />

      {/* Head */}
      <circle cx="28" cy="22" r="15" fill="var(--color-accent)" />

      {/* Wide curious eyes — big bright circles */}
      <circle cx="21" cy="20" r="4"   fill="white" />
      <circle cx="35" cy="20" r="4"   fill="white" />
      <circle cx="22" cy="21" r="2"   fill="var(--color-accent)" />
      <circle cx="36" cy="21" r="2"   fill="var(--color-accent)" />
      {/* Bright highlights */}
      <circle cx="23" cy="19" r="1"   fill="white" opacity="0.9" />
      <circle cx="37" cy="19" r="1"   fill="white" opacity="0.9" />

      {/* Open "ooh!" mouth */}
      <circle cx="28" cy="31" r="3.5" fill="white" opacity="0.85" />

      {/* Body — leaning slightly forward */}
      <ellipse cx="30" cy="52" rx="11" ry="12" fill="var(--color-accent)" opacity="0.7" transform="rotate(-6 30 52)" />

      {/* Arms stretched out — reaching toward the spark */}
      <path d="M20 47 Q11 43 7 37" stroke="var(--color-accent)" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
      <path d="M40 46 Q50 42 56 36" stroke="var(--color-accent)" strokeWidth="5" strokeLinecap="round" opacity="0.7" />

      {/* Legs */}
      <path d="M23 63 L19 75" stroke="var(--color-accent)" strokeWidth="5" strokeLinecap="round" opacity="0.65" />
      <path d="M37 63 L41 75" stroke="var(--color-accent)" strokeWidth="5" strokeLinecap="round" opacity="0.65" />
    </svg>
  )
}
