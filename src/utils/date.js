export function getTodayDate() {
  return new Date().toISOString().split('T')[0]
}

export function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function getDayNumber(installDate) {
  if (!installDate) return 1
  const msPerDay = 1000 * 60 * 60 * 24
  const install = new Date(installDate)
  const iMid = new Date(install.getFullYear(), install.getMonth(), install.getDate())
  const now = new Date()
  const tMid = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.max(1, Math.floor((tMid - iMid) / msPerDay) + 1)
}

export function relativeDate(iso) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 864e5)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return `${days} days ago`
}

// Returns YYYY-MM-DD for the Monday of the current week
export function getWeekStart() {
  const d = new Date()
  const day = d.getDay() // 0=Sun, 1=Mon … 6=Sat
  const diff = day === 0 ? -6 : 1 - day  // shift to Mon
  const mon = new Date(d)
  mon.setDate(d.getDate() + diff)
  return mon.toISOString().slice(0, 10)
}

// 0=Mon … 6=Sun
export function getDayOfWeek() {
  const day = new Date().getDay()
  return day === 0 ? 6 : day - 1
}

export function formatDisplayDate(dateStr) {
  const date = dateStr ? new Date(dateStr + 'T00:00:00') : new Date()
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${days[date.getDay()]} · ${date.getDate()} ${months[date.getMonth()]}`
}
