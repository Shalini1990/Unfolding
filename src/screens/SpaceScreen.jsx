import { useState } from 'react'
import { Wind } from 'lucide-react'
import ParkingLot from '../space/ParkingLot'
import ResolvedSection from '../space/ResolvedSection'
import KindWordsJar from '../space/KindWordsJar'
import TheRoom from '../space/TheRoom'

// ── Mini jar glyph (spec-exact amber) ───────────────────────────
function MiniJar() {
  return (
    <svg width="28" height="34" viewBox="0 0 28 34" fill="none" aria-hidden="true">
      {/* Lid */}
      <rect x="3" y="0" width="22" height="7" rx="3.5" fill="#ec9c54" />
      {/* Body — border on sides + bottom only */}
      <path
        d="M5,7 L23,7 L24.5,29 Q24.5,33 14,33 Q3.5,33 3.5,29 Z"
        fill="#fdfaf3"
        stroke="#f4b860"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function SpaceScreen() {
  const [door,      setDoor]      = useState('park')   // 'park' | 'release'
  const [parkMode,  setParkMode]  = useState('add')    // 'add'  | 'revisit'
  const [kwMode,    setKwMode]    = useState('view')   // 'view' | 'hardday'
  const [roomOpen,  setRoomOpen]  = useState(false)

  const isRevisiting = parkMode === 'revisit'
  const isHardDay    = kwMode   === 'hardday'
  const focused      = isRevisiting || isHardDay

  function handleDoorChange(newDoor) {
    setDoor(newDoor)
    setParkMode('add')   // clear any revisit/focused state from ParkingLot
    setKwMode('view')    // clear any hardday state from KindWordsJar
    const el = document.querySelector('.app-shell__main')
    if (el) el.scrollTop = 0
  }

  function handleRoomClose() {
    setRoomOpen(false)
    setDoor('park')   // spec: return to park door on exit
  }

  return (
    <div className="space-screen">

      {/* ── Header + door selector ──────────────────────────────── */}
      {!focused && (
        <>
          <div className="ys-header">
            <h1 className="ys-title">Your Space</h1>
            <p className="ys-sub">Two ways to put a thought down.</p>
          </div>

          <div className="ys-doors">
            {/* Park it */}
            <button
              className={`ys-door${door === 'park' ? ' ys-door--park-on' : ' ys-door--off'}`}
              onClick={() => handleDoorChange('park')}
              type="button"
            >
              {door === 'park' && (
                <span className="ys-door__chip ys-door__chip--park">SELECTED</span>
              )}
              <div className="ys-door__icon">
                <MiniJar />
              </div>
              <span className="ys-door__title">Park it</span>
              <span className="ys-door__sub">Save · sit with · revisit</span>
            </button>

            {/* Let it out */}
            <button
              className={`ys-door ys-door--release${door === 'release' ? ' ys-door--release-on' : ' ys-door--off'}`}
              onClick={() => handleDoorChange('release')}
              type="button"
            >
              {door === 'release' && (
                <span className="ys-door__chip ys-door__chip--release">SELECTED</span>
              )}
              <div className="ys-door__icon">
                <Wind
                  size={30}
                  strokeWidth={1.8}
                  style={{
                    color: door === 'release' ? '#ff8a3d' : '#9a8b6a',
                  }}
                />
              </div>
              <span className="ys-door__title">Let it out</span>
              <span className="ys-door__sub">Write · release · gone</span>
            </button>
          </div>
        </>
      )}

      {/* ── Park it content ─────────────────────────────────────── */}
      {door === 'park' && !isHardDay && (
        <>
          {!focused && (
            <div className="ys-label-row">
              <span className="ys-label ys-label--park">
                <span className="ys-dot ys-dot--amber" />
                Parking a thought
              </span>
              <span className="ys-label__hint">tap the other door to switch</span>
            </div>
          )}
          <ParkingLot onModeChange={setParkMode} />
          {!focused && <ResolvedSection />}
        </>
      )}

      {/* ── Let it out content ──────────────────────────────────── */}
      {!focused && door === 'release' && (
        <>
          <div className="ys-label-row">
            <span className="ys-label ys-label--release">
              <span className="ys-dot ys-dot--dark" />
              Releasing into the dark
            </span>
            <span className="ys-label__hint">no save · no tags</span>
          </div>

          <div className="ys-release-preview">
            <p className="ys-release-preview__quote">A room with no one in it.</p>
            <p className="ys-release-preview__sub">Write it there. Watch it go.</p>
            <button
              className="ys-open-room-btn"
              onClick={() => setRoomOpen(true)}
              type="button"
            >
              <span className="ys-open-room-btn__dot" />
              Take me to the safe space →
            </button>
          </div>

          <p className="ys-release-back">tap the jar to switch back</p>
        </>
      )}

      {/* ── Kind Words — hidden when release door is active ─────── */}
      {!isRevisiting && door !== 'release' && (
        <>
          {!isHardDay && <div className="space-divider" />}
          <KindWordsJar onModeChange={setKwMode} />
        </>
      )}

      {/* ── The Room overlay ────────────────────────────────────── */}
      {roomOpen && <TheRoom onClose={handleRoomClose} />}

    </div>
  )
}
