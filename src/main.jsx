import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import db from './db/db.js'

// Initialise Dexie database on app load
db.open()
  .then(() => console.log('Database ready'))
  .catch((err) => console.error('Database failed to open:', err))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
