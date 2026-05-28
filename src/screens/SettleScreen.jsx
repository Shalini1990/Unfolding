import { useState } from 'react'
import BoxBreathing from '../settle/BoxBreathing'
import ColourFill from '../settle/ColourFill'

const TABS = [
  { id: 'breathe', label: 'Breathe',      sub: 'Breathe slowly. Nothing else is needed.' },
  { id: 'colour',  label: 'Colour fill',  sub: 'Paint without purpose. Just fill.' },
]

export default function SettleScreen() {
  const [tab, setTab] = useState('breathe')
  const active = TABS.find(t => t.id === tab)

  return (
    <div className={`settle-screen${tab === 'colour' ? ' settle-screen--fill' : ''}`}>

      <div className="settle-header">
        <h1 className="settle-title">Settle</h1>
        <p className="settle-sub">{active.sub}</p>
      </div>

      <div className="settle-tabs">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`settle-tab${tab === t.id ? ' settle-tab--active' : ''}`}
            onClick={() => setTab(t.id)}
            type="button"
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'breathe' && <BoxBreathing />}
      {tab === 'colour'  && <ColourFill />}

    </div>
  )
}
