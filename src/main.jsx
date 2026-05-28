import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { useRegisterSW } from 'virtual:pwa-register/react'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import db from './db/db.js'

// Initialise Dexie database on app load
db.open()
  .then(() => console.log('Database ready'))
  .catch((err) => console.error('Database failed to open:', err))

// ── SW update toast ────────────────────────────────────────────────
// Shows a small banner when a new SW version is waiting to activate.
function SWUpdateToast() {
  const [show, setShow] = useState(false)

  const { updateServiceWorker } = useRegisterSW({
    onNeedRefresh() { setShow(true) },
    onOfflineReady() {},
  })

  if (!show) return null

  return (
    <div className="sw-update-toast" role="status">
      <span className="sw-update-toast__text">New version available.</span>
      <button
        className="sw-update-toast__btn"
        onClick={() => { setShow(false); updateServiceWorker(true) }}
        type="button"
      >
        Refresh
      </button>
      <button
        className="sw-update-toast__close"
        onClick={() => setShow(false)}
        type="button"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <SWUpdateToast />
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>,
)
