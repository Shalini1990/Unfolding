import { NavLink } from 'react-router-dom'
import { Sun, Leaf, Waves, User } from 'lucide-react'

const TABS = [
  { to: '/home',   label: 'Home',   Icon: Sun   },
  { to: '/space',  label: 'Space',  Icon: Leaf  },
  { to: '/settle', label: 'Settle', Icon: Waves },
  { to: '/me',     label: 'Me',     Icon: User  },
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {TABS.map(({ to, label, Icon }) => (
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
