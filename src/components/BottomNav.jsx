import { NavLink } from 'react-router-dom'
import { Sun, Leaf, Waves, User } from 'lucide-react'
import { useFeatures } from '../context/FeaturesContext'

// feature: null = always shown
const ALL_TABS = [
  { to: '/home',   label: 'Home',   Icon: Sun,   feature: null     },
  { to: '/space',  label: 'Space',  Icon: Leaf,  feature: 'space'  },
  { to: '/settle', label: 'Settle', Icon: Waves, feature: 'settle' },
  { to: '/me',     label: 'Me',     Icon: User,  feature: null     },
]

export default function BottomNav() {
  const { features } = useFeatures()
  const tabs = ALL_TABS.filter(t => t.feature === null || features.includes(t.feature))

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {tabs.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `bottom-nav__tab${isActive ? ' bottom-nav__tab--active' : ''}`
          }
          aria-label={label}
        >
          <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
