import React, { useEffect, useState } from 'react'

export default function Countdown({ date }) {
  const [timeLeft, setTimeLeft] = useState({})

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const diff = new Date(date) - now
      if (diff <= 0) return setTimeLeft({ ended: true })
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((diff / (1000 * 60)) % 60)
      const seconds = Math.floor((diff / 1000) % 60)
      setTimeLeft({ days, hours, minutes, seconds })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [date])

  if (timeLeft.ended) return <div>¡Partido en curso o terminado!</div>
  return <div className="text-xl font-bold">{timeLeft.days ?? 0}d {timeLeft.hours ?? 0}h {timeLeft.minutes ?? 0}m {timeLeft.seconds ?? 0}s</div>
}
