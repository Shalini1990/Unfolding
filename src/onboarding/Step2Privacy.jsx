import { Lock, HardDrive, AlertTriangle, Download } from 'lucide-react'

const POINTS = [
  {
    icon: HardDrive,
    text: 'Everything you write is stored in your browser, on this device only.',
  },
  {
    icon: Lock,
    text: 'We cannot see it. No account. No cloud. Nobody but you.',
  },
  {
    icon: Download,
    text: 'You can export all your entries anytime as a backup from the Me tab.',
  },
]

export default function Step2Privacy({ next }) {
  return (
    <div className="ob-screen">
      <div className="ob-content">
        <div className="ob-icon-wrap">
          <Lock size={24} strokeWidth={1.5} aria-hidden="true" />
        </div>
        <h2 className="ob-title">Your words, yours alone.</h2>
        <p className="ob-subtitle">
          Unfolding is a private space — no servers, no sync, no sign-in.
        </p>

        <ul className="ob-privacy-list">
          {POINTS.map(({ icon: Icon, text }) => (
            <li key={text} className="ob-privacy-item">
              <span className="ob-privacy-item__icon">
                <Icon size={14} strokeWidth={2} aria-hidden="true" />
              </span>
              <span>{text}</span>
            </li>
          ))}
        </ul>

        <div className="ob-privacy-warn">
          <AlertTriangle size={14} strokeWidth={2} className="ob-privacy-warn__icon" aria-hidden="true" />
          <p className="ob-privacy-warn__text">
            <strong>One thing to know:</strong> clearing your browser's site data
            (storage, cookies, cache) will erase your entries. Export regularly if
            that's a concern.
          </p>
        </div>
      </div>

      <div className="ob-footer">
        <button className="ob-cta" onClick={next} type="button">
          Got it
        </button>
      </div>
    </div>
  )
}
