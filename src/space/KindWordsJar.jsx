import { useState, useEffect, useRef } from 'react'
import { Heart, Plus, X, Info, ChevronLeft, ChevronRight } from 'lucide-react'
import db from '../db/db'
import PrivacyNudge from '../components/PrivacyNudge'

export default function KindWordsJar({ onModeChange }) {
  const [words,      setWords]      = useState([])
  const [mode,       setMode]       = useState('view')   // 'view' | 'add' | 'hardday'
  const [showInfo,   setShowInfo]   = useState(false)
  const [addText,    setAddText]    = useState('')
  const [revealedId, setRevealedId] = useState(null)
  const [hdWords,    setHdWords]    = useState([])
  const [hdIdx,      setHdIdx]      = useState(0)
  const [addedMsg,   setAddedMsg]   = useState(false)
  const infoRef = useRef(null)

  useEffect(() => { loadWords() }, [])

  // Close tooltip when clicking outside
  useEffect(() => {
    if (!showInfo) return
    function onOutside(e) {
      if (infoRef.current && !infoRef.current.contains(e.target)) {
        setShowInfo(false)
      }
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [showInfo])

  async function loadWords() {
    const all = await db.kind_words.orderBy('createdAt').reverse().toArray()
    setWords(all)
  }

  async function handleAdd() {
    const trimmed = addText.trim()
    if (!trimmed) return
    const now = new Date().toISOString()
    const id  = await db.kind_words.add({ text: trimmed, createdAt: now })
    setWords(prev => [{ id, text: trimmed, createdAt: now }, ...prev])
    setAddText('')
    setMode('view')
    setAddedMsg(true)
    setTimeout(() => setAddedMsg(false), 1600)
  }

  async function handleDelete(id) {
    await db.kind_words.delete(id)
    setWords(prev => prev.filter(w => w.id !== id))
    setRevealedId(null)
  }

  async function handleHardDayDelete(id) {
    await db.kind_words.delete(id)
    setWords(prev => prev.filter(w => w.id !== id))
    const next = hdWords.filter(w => w.id !== id)
    if (next.length === 0) { setMode('view'); onModeChange?.('view'); return }
    setHdWords(next)
    setHdIdx(i => Math.min(i, next.length - 1))
  }

  function enterHardDay() {
    const shuffled = [...words].sort(() => Math.random() - 0.5).slice(0, 3)
    setHdWords(shuffled)
    setHdIdx(0)
    setMode('hardday')
    onModeChange?.('hardday')
  }

  // ── Hard day mode ──────────────────────────────────────────────
  if (mode === 'hardday') {
    const current = hdWords[hdIdx]
    return (
      <div className="kw-hardday">
        <div className="kw-hardday__header">
          <button
            className="kw-hardday__back"
            onClick={() => { setMode('view'); onModeChange?.('view') }}
            type="button"
          >
            <ChevronLeft size={16} strokeWidth={2.2} />
            Back
          </button>
          <span className="kw-hardday__progress">
            {hdIdx + 1} / {hdWords.length}
          </span>
        </div>

        <p className="kw-hardday__label">Someone thought this about you.</p>

        <div className="kw-hardday__card">
          <Heart size={20} strokeWidth={1.8} className="kw-hardday__heart" />
          <p className="kw-hardday__text">{current?.text}</p>
        </div>

        <div className="kw-hardday__nav">
          <button
            className="kw-hardday__arrow"
            onClick={() => setHdIdx(n => n - 1)}
            disabled={hdIdx === 0}
            type="button"
            aria-label="Previous"
          >
            <ChevronLeft size={22} strokeWidth={2.2} />
          </button>
          <button
            className="kw-hardday__arrow"
            onClick={() => setHdIdx(n => n + 1)}
            disabled={hdIdx === hdWords.length - 1}
            type="button"
            aria-label="Next"
          >
            <ChevronRight size={22} strokeWidth={2.2} />
          </button>
        </div>

        <button
          className="kw-hardday__delete"
          onClick={() => handleHardDayDelete(current.id)}
          type="button"
        >
          Remove this one
        </button>
      </div>
    )
  }

  // ── Add mode ───────────────────────────────────────────────────
  if (mode === 'add') {
    return (
      <div className="kw-jar">
        <div className="kw-header">
          <div className="kw-header__left">
            <Heart size={17} strokeWidth={2} className="kw-header__icon" />
            <span className="kw-header__title">Kind Words</span>
          </div>
        </div>
        <PrivacyNudge featureKey="kind_words" />
        <textarea
          className="kw-add-input"
          value={addText}
          onChange={e => setAddText(e.target.value)}
          placeholder="Add a kind word…"
          rows={3}
          autoFocus
        />
        <div className="kw-add-actions">
          <button
            className="kw-add-save"
            onClick={handleAdd}
            disabled={!addText.trim()}
            type="button"
          >
            Save
          </button>
          <button
            className="kw-add-cancel"
            onClick={() => { setMode('view'); setAddText('') }}
            type="button"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  // Shared header with info icon
  const header = (
    <div className="kw-header">
      <div className="kw-header__left">
        <Heart size={17} strokeWidth={2} className="kw-header__icon" />
        <span className="kw-header__title">Kind Words</span>

        {/* Info icon + tooltip */}
        <div
          className="kw-info-wrap"
          ref={infoRef}
          onMouseEnter={() => setShowInfo(true)}
          onMouseLeave={() => setShowInfo(false)}
        >
          <button
            className="kw-info-btn"
            onClick={() => setShowInfo(v => !v)}
            type="button"
            aria-label="What are kind words?"
          >
            <Info size={14} strokeWidth={2} />
          </button>
          {showInfo && (
            <div className="kw-tooltip" role="tooltip">
              Something kind that someone said to you, or a moment you noticed something
              good in yourself — both count.
            </div>
          )}
        </div>

        {words.length > 0 && (
          <span className="kw-header__count">{words.length}</span>
        )}
      </div>
      <button
        className="kw-add-btn"
        onClick={() => setMode('add')}
        type="button"
        aria-label="Add kind word"
      >
        <Plus size={18} strokeWidth={2.2} />
      </button>
    </div>
  )

  // ── View mode ──────────────────────────────────────────────────
  return (
    <div className="kw-jar">
      {header}

      {addedMsg && <p className="kw-added-msg">Added ✓</p>}

      {words.length === 0 ? (
        <p className="kw-empty">Kind words live here. Add the first one.</p>
      ) : (
        <>
          <div
            className={`kw-item kw-item--solo${revealedId === words[0].id ? ' kw-item--revealed' : ''}`}
            onClick={() => setRevealedId(prev => prev === words[0].id ? null : words[0].id)}
            role="button"
            tabIndex={0}
          >
            <p className="kw-item__text">{words[0].text}</p>
            {revealedId === words[0].id && (
              <button
                className="kw-item__delete"
                onClick={e => { e.stopPropagation(); handleDelete(words[0].id) }}
                type="button"
                aria-label="Delete"
              >
                <X size={14} strokeWidth={2.5} />
              </button>
            )}
          </div>

          {words.length >= 3 && (
            <button className="kw-hardday-btn" onClick={enterHardDay} type="button">
              Having a hard day? Read these.
            </button>
          )}
        </>
      )}
    </div>
  )
}
