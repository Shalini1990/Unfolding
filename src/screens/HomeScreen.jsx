export default function HomeScreen() {
  return (
    <div className="screen">
      <p className="screen__eyebrow">Daily</p>
      <h1 className="screen__title">Home</h1>
      <p className="screen__desc">
        Your morning intention, daily spark, and today's small wins will live
        here. Start each day grounded and clear.
      </p>

      <div className="screen__card">
        <p className="screen__card-label">Coming soon</p>
        <p className="screen__card-value">
          Morning intention · Today's spark · Wins log · Parking lot
        </p>
      </div>
    </div>
  )
}
