import { StargazingCharacter } from '../components/DoneCharacter'

export default function NorthStarLine({ text }) {
  if (!text) return null
  return (
    <div className="home-north-star-wrap">
      <div className="home-north-star-card">
        <p className="home-north-star-label">My one thing</p>
        <p className="home-north-star">{text}</p>
      </div>
      <StargazingCharacter />
    </div>
  )
}
