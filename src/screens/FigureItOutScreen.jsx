import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Send } from 'lucide-react'
import db from '../db/db'
import ClarityCard from '../space/ClarityCard'

const MODES = ['Untangle', 'Decide', 'Unstuck', 'Vent and Solve', 'Reframe', 'Prepare']

const MODE_DESCRIPTIONS = {
  'Untangle':      'Break it into steps',
  'Decide':        'Surface what matters most',
  'Unstuck':       "Find what's blocking you",
  'Vent and Solve': 'Be heard, then decide',
  'Reframe':       'Find a new angle',
  'Prepare':       'Think it through first',
}

// ── Helpers ───────────────────────────────────────────────────────
function parseAIResponse(raw) {
  // Extract MODE:
  const modeMatch = raw.match(/^MODE:\s*(.+)$/m)
  const mode = modeMatch ? modeMatch[1].trim() : null

  // Extract CLARITY_CARD:
  const clarityMatch = raw.match(/CLARITY_CARD:(\{[\s\S]*\})/)
  let clarityCard = null
  if (clarityMatch) {
    try { clarityCard = JSON.parse(clarityMatch[1]) } catch { /* ignore */ }
  }

  // Display text — strip the signal lines
  const text = raw
    .replace(/^MODE:\s*.+$/m, '')
    .replace(/CLARITY_CARD:\{[\s\S]*\}/, '')
    .trim()

  return { text, mode, clarityCard }
}

async function callAPI({ messages, tag, northStar, confirmedMode, profile }) {
  const res = await fetch('/api/chat', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ messages, tag, northStar, confirmedMode, profile }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Request failed (${res.status})`)
  }
  return res.json()
}

// ── Typing indicator ──────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="chat-bubble chat-bubble--ai chat-bubble--typing">
      <span className="typing-dot" />
      <span className="typing-dot" />
      <span className="typing-dot" />
    </div>
  )
}

// ── Chat bubble ───────────────────────────────────────────────────
function Bubble({ role, text }) {
  return (
    <div className={`chat-bubble chat-bubble--${role === 'user' ? 'user' : 'ai'}`}>
      <p className="chat-bubble__text">{text}</p>
    </div>
  )
}

// ── Mode banner ───────────────────────────────────────────────────
function ModeBanner({ mode, onChangeRequest }) {
  return (
    <div className="figureout-mode-banner">
      <span className="figureout-mode-chip">{mode}</span>
      <button
        className="figureout-mode-change"
        onClick={onChangeRequest}
        type="button"
      >
        Different approach?
      </button>
    </div>
  )
}

// ── Mode menu ────────────────────────────────────────────────────
function ModeMenu({ current, onSelect, onClose }) {
  return (
    <div className="figureout-mode-menu-overlay" onClick={onClose}>
      <div className="figureout-mode-menu" onClick={e => e.stopPropagation()}>
        <p className="figureout-mode-menu__label">Choose an approach</p>
        {MODES.map(m => (
          <button
            key={m}
            className={`figureout-mode-option${m === current ? ' figureout-mode-option--active' : ''}`}
            onClick={() => onSelect(m)}
            type="button"
          >
            <span className="figureout-mode-option__name">{m}</span>
            <span className="figureout-mode-option__desc">{MODE_DESCRIPTIONS[m]}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Privacy notice ────────────────────────────────────────────────
function PrivacyNotice({ onAccept }) {
  return (
    <div className="figureout-privacy">
      <p className="figureout-privacy__icon">🔒</p>
      <h2 className="figureout-privacy__title">Before we begin</h2>
      <p className="figureout-privacy__body">
        This conversation is temporary — it's cleared as soon as you leave.
        Only the clarity card is saved, and only if you choose to save it.
        Your thoughts are sent to an AI model to help you think things through,
        but are not stored after the session ends.
      </p>
      <button className="figureout-privacy__btn" onClick={onAccept} type="button">
        Got it, let's go
      </button>
    </div>
  )
}

// ── Root ─────────────────────────────────────────────────────────
export default function FigureItOutScreen() {
  const { state } = useLocation()
  const navigate  = useNavigate()

  const thought   = state?.thought ?? null
  const tag       = state?.tag     ?? null
  const thoughtId = state?.id      ?? null

  // Phase: null (loading) → 'privacy' | 'opening' | 'chatting' | 'done'
  const [phase,         setPhase]         = useState(null)
  const [northStar,     setNorthStar]     = useState(null)
  const [profile,       setProfile]       = useState({})
  const [messages,      setMessages]      = useState([])   // API format
  const [bubbles,       setBubbles]       = useState([])   // display format
  const [confirmedMode, setConfirmedMode] = useState(null)
  const [detectedMode,  setDetectedMode]  = useState(null)
  const [loading,       setLoading]       = useState(false)
  const [error,         setError]         = useState(null)
  const [openingText,   setOpeningText]   = useState('')
  const [inputText,     setInputText]     = useState('')
  const [exchangeCount, setExchangeCount] = useState(0)
  const [clarityCard,   setClarityCard]   = useState(null)
  const [showModeMenu,  setShowModeMenu]  = useState(false)

  const bottomRef   = useRef(null)
  const inputRef    = useRef(null)

  // ── Init ────────────────────────────────────────────────────────
  useEffect(() => {
    async function init() {
      const [seen, ns, pName, pAge, pSex] = await Promise.all([
        db.settings.where('key').equals('figureout_seen_privacy').first(),
        db.north_star.get(1),
        db.settings.where('key').equals('profile_name').first(),
        db.settings.where('key').equals('profile_age') .first(),
        db.settings.where('key').equals('profile_sex') .first(),
      ])
      setNorthStar(ns?.text ?? null)
      setProfile({
        name: pName?.value || '',
        age:  pAge?.value  || '',
        sex:  pSex?.value  || '',
      })
      setPhase(seen ? 'opening' : 'privacy')
    }
    init()
  }, [])

  // Auto-scroll on new bubble
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [bubbles, loading])

  // ── API call ────────────────────────────────────────────────────
  async function sendToAI(newMessages, mode = confirmedMode) {
    setLoading(true)
    setError(null)
    try {
      const { content } = await callAPI({
        messages:      newMessages,
        tag,
        northStar,
        confirmedMode: mode,
        profile,
      })
      const { text, mode: parsedMode, clarityCard: parsed } = parseAIResponse(content)

      // Update detected mode
      if (parsedMode && !confirmedMode) {
        setDetectedMode(parsedMode)
      }

      // Add AI bubble
      if (text) {
        setBubbles(prev => [...prev, { role: 'assistant', text }])
      }

      // Store full raw response in messages for API history
      setMessages(prev => [...prev, { role: 'assistant', content }])

      // Clarity card
      if (parsed) {
        setClarityCard(parsed)
        setPhase('done')
      }

      setExchangeCount(n => n + 1)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── Opening submit ───────────────────────────────────────────────
  async function handleOpeningSubmit() {
    const trimmed = openingText.trim()
    if (!trimmed || loading) return

    // Build first user message — include parked thought as context if present
    const apiContent = thought
      ? `[Context from my parking lot: "${thought}"]\n\n${trimmed}`
      : trimmed

    const firstMessage = { role: 'user', content: apiContent }
    const newMessages  = [firstMessage]

    setBubbles([{ role: 'user', text: trimmed }])
    setMessages(newMessages)
    setPhase('chatting')
    await sendToAI(newMessages, null)
  }

  // ── Chat submit ──────────────────────────────────────────────────
  async function handleChatSubmit() {
    const trimmed = inputText.trim()
    if (!trimmed || loading) return
    setInputText('')

    const userMsg    = { role: 'user', content: trimmed }
    const newMessages = [...messages, userMsg]

    setBubbles(prev => [...prev, { role: 'user', text: trimmed }])
    setMessages(newMessages)
    await sendToAI(newMessages)
  }

  // ── Wrap up ──────────────────────────────────────────────────────
  async function handleWrapUp() {
    if (loading) return
    const wrapMsg    = { role: 'user', content: "I'm ready to wrap up. Please generate my clarity card." }
    const newMessages = [...messages, wrapMsg]

    setBubbles(prev => [...prev, { role: 'user', text: "I'm ready to wrap up." }])
    setMessages(newMessages)
    await sendToAI(newMessages)
  }

  // ── Mode change ──────────────────────────────────────────────────
  async function handleModeSelect(newMode) {
    setShowModeMenu(false)
    setConfirmedMode(newMode)
    setDetectedMode(newMode)

    const switchMsg   = { role: 'user', content: `Let's switch to ${newMode} mode instead.` }
    const newMessages = [...messages, switchMsg]

    setBubbles(prev => [...prev, { role: 'user', text: `Let's switch to ${newMode} mode instead.` }])
    setMessages(newMessages)
    await sendToAI(newMessages, newMode)
  }

  // ── Mode confirm ─────────────────────────────────────────────────
  function handleConfirmMode() {
    setConfirmedMode(detectedMode)
  }

  // ── Accept privacy ───────────────────────────────────────────────
  async function acceptPrivacy() {
    const existing = await db.settings.where('key').equals('figureout_seen_privacy').first()
    if (existing) {
      await db.settings.update(existing.id, { value: 'true' })
    } else {
      await db.settings.add({ key: 'figureout_seen_privacy', value: 'true' })
    }
    setPhase('opening')
  }

  // ── Render: loading ──────────────────────────────────────────────
  if (phase === null) return null

  // ── Render: privacy ──────────────────────────────────────────────
  if (phase === 'privacy') {
    return (
      <div className="figureout-screen screen">
        <button className="figureout-back" onClick={() => navigate(-1)} type="button">
          <ArrowLeft size={18} strokeWidth={2} /> Back
        </button>
        <PrivacyNotice onAccept={acceptPrivacy} />
      </div>
    )
  }

  // ── Render: done (clarity card) ──────────────────────────────────
  if (phase === 'done' && clarityCard) {
    return (
      <div className="figureout-screen screen">
        <button className="figureout-back" onClick={() => navigate(-1)} type="button">
          <ArrowLeft size={18} strokeWidth={2} /> Back
        </button>
        <ClarityCard
          card={clarityCard}
          thoughtId={thoughtId}
          onDone={() => navigate(-1)}
        />
      </div>
    )
  }

  // ── Render: opening ──────────────────────────────────────────────
  if (phase === 'opening') {
    return (
      <div className="figureout-screen screen">
        <button className="figureout-back" onClick={() => navigate(-1)} type="button">
          <ArrowLeft size={18} strokeWidth={2} /> Back
        </button>

        <h1 className="figureout-title">Let's figure it out.</h1>

        {thought && (
          <div className="figureout-context">
            {tag && <span className="figureout-context__tag">{tag}</span>}
            <p className="figureout-context__text">{thought}</p>
          </div>
        )}

        <p className="figureout-opening-prompt">
          What's going on? Describe it in your own words.
        </p>

        <textarea
          className="figureout-answer"
          value={openingText}
          onChange={e => setOpeningText(e.target.value)}
          placeholder="Take your time…"
          rows={5}
          autoFocus
          onKeyDown={e => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleOpeningSubmit()
          }}
        />

        <button
          className="figureout-next-btn"
          onClick={handleOpeningSubmit}
          disabled={!openingText.trim()}
          type="button"
        >
          Let's go →
        </button>
      </div>
    )
  }

  // ── Render: chatting ─────────────────────────────────────────────
  const displayMode = confirmedMode ?? detectedMode

  return (
    <div className="figureout-screen figureout-screen--chat">
      {/* Header */}
      <div className="figureout-chat-header">
        <button className="figureout-back figureout-back--chat" onClick={() => navigate(-1)} type="button">
          <ArrowLeft size={18} strokeWidth={2} />
        </button>
        {displayMode && (
          <ModeBanner
            mode={displayMode}
            onChangeRequest={() => setShowModeMenu(true)}
          />
        )}
        {!confirmedMode && detectedMode && (
          <button
            className="figureout-mode-confirm"
            onClick={handleConfirmMode}
            type="button"
          >
            ✓ That works
          </button>
        )}
      </div>

      {/* Chat area */}
      <div className="figureout-chat-area">
        {bubbles.map((b, i) => (
          <Bubble key={i} role={b.role} text={b.text} />
        ))}
        {loading && <TypingIndicator />}
        {error && (
          <p className="figureout-error">
            Something went wrong. {error}
          </p>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Wrap up button — appears after 3 exchanges */}
      {exchangeCount >= 3 && !loading && phase !== 'done' && (
        <div className="figureout-wrapup-row">
          <button className="figureout-wrapup-btn" onClick={handleWrapUp} type="button">
            Ready to wrap up
          </button>
        </div>
      )}

      {/* Input bar */}
      <div className="figureout-input-bar">
        <textarea
          ref={inputRef}
          className="figureout-chat-input"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="Reply…"
          rows={1}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleChatSubmit()
            }
          }}
        />
        <button
          className="figureout-send-btn"
          onClick={handleChatSubmit}
          disabled={!inputText.trim() || loading}
          type="button"
          aria-label="Send"
        >
          <Send size={16} strokeWidth={2.2} />
        </button>
      </div>

      {/* Mode menu overlay */}
      {showModeMenu && (
        <ModeMenu
          current={displayMode}
          onSelect={handleModeSelect}
          onClose={() => setShowModeMenu(false)}
        />
      )}
    </div>
  )
}
