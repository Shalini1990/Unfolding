import { StargazingCharacter } from '../components/DoneCharacter'

export default function NorthStarLine({ text }) {
  if (!text) return null
  return (
    <div className="home-north-star-wrap">
      <p className="home-north-star">{text}</p>
      <StargazingCharacter />
    </div>
  )
}
