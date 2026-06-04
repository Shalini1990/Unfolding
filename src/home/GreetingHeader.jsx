import { useState, useEffect } from 'react'
import { getGreeting, formatDisplayDate } from '../utils/date'
import db from '../db/db'

export default function GreetingHeader({ date }) {
  const [firstName, setFirstName] = useState('')

  useEffect(() => {
    db.settings.where('key').equals('profile_name').first()
      .then(r => {
        if (r?.value) setFirstName(r.value.trim().split(/\s+/)[0])
      })
      .catch(() => {})
  }, [])

  const greeting = firstName ? `${getGreeting()}, ${firstName}` : getGreeting()

  return (
    <div className="home-greeting">
      <h1 className="home-greeting__text">{greeting}</h1>
      <p className="home-greeting__date">{formatDisplayDate(date)}</p>
    </div>
  )
}
