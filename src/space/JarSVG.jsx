// Predefined blob positions inside the jar body (SVG units, viewBox 0 0 100 130)
const BLOBS = [
  { cx: 42, cy: 104, r: 10 },
  { cx: 62, cy: 98,  r:  8 },
  { cx: 52, cy: 80,  r: 11 },
  { cx: 30, cy: 76,  r:  7 },
  { cx: 68, cy: 78,  r:  8 },
  { cx: 50, cy: 58,  r:  9 },
]

// Jar body path: top at y=28, rounded bottom at y=118
const BODY_PATH = 'M22,28 L78,28 L81,108 Q81,118 50,118 Q19,118 19,108 Z'

export default function JarSVG({ count = 0 }) {
  const visible = Math.min(count, BLOBS.length)

  return (
    <svg viewBox="0 0 100 130" className="jar-svg" aria-hidden="true">
      <defs>
        <clipPath id="jar-clip">
          <path d={BODY_PATH} />
        </clipPath>
      </defs>

      {/* Body background */}
      <path d={BODY_PATH} fill="var(--color-surface)" />

      {/* Thought blobs (clipped inside jar) */}
      <g clipPath="url(#jar-clip)">
        {BLOBS.slice(0, visible).map((b, i) => (
          <circle
            key={i}
            cx={b.cx} cy={b.cy} r={b.r}
            fill="var(--color-accent)"
            opacity={0.18 + i * 0.02}
          />
        ))}
      </g>

      {/* Body outline on top */}
      <path
        d={BODY_PATH}
        fill="none"
        stroke="var(--color-border)"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      {/* Lid */}
      <rect x="14" y="6" width="72" height="24" rx="12" fill="var(--color-accent)" />

      {/* Lid shine */}
      <rect x="22" y="12" width="28" height="7" rx="3.5" fill="white" opacity="0.22" />
    </svg>
  )
}
