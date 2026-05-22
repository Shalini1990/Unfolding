import { Navigate, Route, Routes } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import PauseButton from './components/PauseButton'
import HomeScreen from './screens/HomeScreen'
import SpaceScreen from './screens/SpaceScreen'
import SettleScreen from './screens/SettleScreen'
import MeScreen from './screens/MeScreen'

export default function App() {
  return (
    <div className="app-shell">
      <main className="app-shell__main">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home"   element={<HomeScreen />}   />
          <Route path="/space"  element={<SpaceScreen />}  />
          <Route path="/settle" element={<SettleScreen />} />
          <Route path="/me"     element={<MeScreen />}     />
        </Routes>
      </main>

      {/* Always-visible floating pause button — sits above the nav bar */}
      <PauseButton />

      {/* Fixed bottom navigation */}
      <BottomNav />
    </div>
  )
}
