'use client'

import { useEffect, useState } from 'react'

const formatter = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  hour12: false,
  minute: '2-digit',
  timeZone: 'Asia/Kolkata',
})

export function LocalTime() {
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    const tick = () => setTime(formatter.format(new Date()))
    tick()
    const id = setInterval(tick, 15_000)
    return () => clearInterval(id)
  }, [])

  return (
    <span className='tabular-nums'>
      {time ?? '--:--'}
      <span className='text-muted-foreground/70'> IST</span>
    </span>
  )
}
