export default function NorthStarLine({ text }) {
  if (!text) return null
  return (
    <p className="home-north-star">{text}</p>
  )
}
