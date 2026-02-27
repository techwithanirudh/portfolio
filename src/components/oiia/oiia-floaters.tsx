'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useOiiaMode } from './oiia-provider'

type Floater = {
  id: number
  size: number
  x: number
  y: number
  vx: number
  vy: number
  bornAt: number
}

type Burst = {
  id: number
  x: number
  y: number
  size: number
  src: string
}

const GifUrl = 'https://media.tenor.com/8VuZc8I8f7EAAAAj/oiia-cat.gif'
const BurstGifUrl =
  'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2VheHloMDJwejloZHdmMXJ0dDRzcjZ0YWQ2MjducmlsOGZldjZldiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l41m6hqhosqjW2Rag/giphy.gif'
const HeartsGifUrl = 'https://tenor.com/e5szhBKD19x.gif'
const FloatersCount = 4
const MaxFloaters = 18
const MinSpeed = 0.4
const MaxSpeed = 1.1
const MinSize = 56
const MaxSize = 92

const randomBetween = (min: number, max: number) =>
  Math.random() * (max - min) + min

const createFloater = (id: number, width: number, height: number): Floater => {
  const size = randomBetween(MinSize, MaxSize)
  const x = randomBetween(0, Math.max(0, width - size))
  const y = randomBetween(0, Math.max(0, height - size))
  const speed = randomBetween(MinSpeed, MaxSpeed)
  const angle = randomBetween(0, Math.PI * 2)
  return {
    id,
    size,
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    bornAt: performance.now(),
  }
}

export function OiiaFloaters() {
  const { mode, spawnRequest } = useOiiaMode()
  const isOiia = mode === 'oiia'
  const nodesRef = useRef<Array<HTMLDivElement | null>>([])
  const rafRef = useRef<number | null>(null)
  const floatersRef = useRef<Floater[]>([])
  const idRef = useRef(0)
  const burstIdRef = useRef(0)
  const burstTimeoutsRef = useRef<number[]>([])
  const [floaters, setFloaters] = useState<Floater[]>([])
  const [bursts, setBursts] = useState<Burst[]>([])
  const dragRef = useRef<{
    id: number | null
    offsetX: number
    offsetY: number
  }>({ id: null, offsetX: 0, offsetY: 0 })

  const resetFloaters = useCallback(() => {
    if (typeof window === 'undefined') {
      return
    }
    idRef.current = 0
    const next = Array.from({ length: FloatersCount }, () => {
      const floater = createFloater(
        idRef.current,
        window.innerWidth,
        window.innerHeight
      )
      idRef.current += 1
      return floater
    })
    setFloaters(next)
    floatersRef.current = next
    nodesRef.current = []
  }, [])

  const spawnFloater = useCallback(
    (at?: { x: number; y: number; vx?: number; vy?: number }) => {
    if (typeof window === 'undefined') {
      return
    }
    const next = createFloater(
      idRef.current,
      window.innerWidth,
      window.innerHeight
    )
    if (at) {
      const jitter = randomBetween(-12, 12)
      const dirX = at.vx ? Math.sign(at.vx) : 1
      const dirY = at.vy ? Math.sign(at.vy) : 1
      const assOffsetX = -dirX * (next.size * 0.35)
      const assOffsetY = -dirY * (next.size * 0.35)
      next.x = Math.max(
        0,
        Math.min(window.innerWidth - next.size, at.x + assOffsetX + jitter)
      )
      next.y = Math.max(
        0,
        Math.min(window.innerHeight - next.size, at.y + assOffsetY + jitter)
      )
    }
    const burstId = burstIdRef.current
    burstIdRef.current += 1
    const burstSize = next.size * 0.95
    const burstX = next.x + next.size * 0.5 - burstSize * 0.5
    const burstY = next.y + next.size * 0.5 - burstSize * 0.5
    const burstSrc = Math.random() > 0.4 ? HeartsGifUrl : BurstGifUrl
    setBursts((prev) => [
      ...prev,
      { id: burstId, x: burstX, y: burstY, size: burstSize, src: burstSrc },
    ])
    const timeout = window.setTimeout(() => {
      setBursts((prev) => prev.filter((burst) => burst.id !== burstId))
    }, 700)
    burstTimeoutsRef.current.push(timeout)
    idRef.current += 1
    setFloaters((prev) => {
      const updated = [...prev, next]
      floatersRef.current = updated
      return updated
    })
  },
  []
  )

  useEffect(() => {
    if (!isOiia) {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      return
    }

    if (floaters.length === 0) {
      resetFloaters()
      return
    }

    floatersRef.current = floaters

    let last = performance.now()

    const tick = (now: number) => {
      const dt = Math.min(32, now - last)
      last = now

      const width = window.innerWidth
      const height = window.innerHeight

      for (let index = 0; index < floatersRef.current.length; index += 1) {
        const floater = floatersRef.current[index]
        if (!floater) {
          continue
        }
        const isDragging = dragRef.current.id === floater.id
        const nextX = isDragging
          ? floater.x
          : floater.x + floater.vx * dt * 0.05
        const nextY = isDragging
          ? floater.y
          : floater.y + floater.vy * dt * 0.05

        if (!isDragging && (nextX <= 0 || nextX + floater.size >= width)) {
          floater.vx *= -1
        }
        if (!isDragging && (nextY <= 0 || nextY + floater.size >= height)) {
          floater.vy *= -1
        }

        floater.x = Math.max(0, Math.min(width - floater.size, nextX))
        floater.y = Math.max(0, Math.min(height - floater.size, nextY))

        const node = nodesRef.current[index]
        if (node) {
          const scale = isDragging ? '1.15, 0.82' : '1, 1'
          node.style.transform = `translate3d(${floater.x}px, ${floater.y}px, 0) scale(${scale})`
        }
      }

      // collision-based reproduction removed; we spawn on a timed cadence instead

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [floaters, isOiia, resetFloaters, spawnFloater])

  useEffect(() => {
    if (!isOiia) {
      return
    }
    resetFloaters()
  }, [isOiia, resetFloaters])

  useEffect(() => {
    if (!isOiia) {
      return
    }

    const interval = window.setInterval(() => {
      if (floatersRef.current.length >= MaxFloaters) {
        return
      }
      const parent =
        floatersRef.current[
          Math.floor(Math.random() * floatersRef.current.length)
        ]
      if (!parent) {
        return
      }
      spawnFloater({ x: parent.x, y: parent.y, vx: parent.vx, vy: parent.vy })
    }, 1200)

    return () => window.clearInterval(interval)
  }, [isOiia, spawnFloater])

  useEffect(() => {
    if (!isOiia || spawnRequest === 0) {
      return
    }
    spawnFloater()
  }, [isOiia, spawnRequest, spawnFloater])

  useEffect(() => {
    if (!isOiia) {
      return
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (dragRef.current.id == null) {
        return
      }
      const target = floatersRef.current.find(
        (floater) => floater.id === dragRef.current.id
      )
      if (!target) {
        return
      }
      target.x = Math.max(
        0,
        Math.min(
          window.innerWidth - target.size,
          event.clientX - dragRef.current.offsetX
        )
      )
      target.y = Math.max(
        0,
        Math.min(
          window.innerHeight - target.size,
          event.clientY - dragRef.current.offsetY
        )
      )
    }

    const handlePointerUp = () => {
      dragRef.current.id = null
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
    }
  }, [isOiia])

  useEffect(() => {
    return () => {
      for (const timeout of burstTimeoutsRef.current) {
        window.clearTimeout(timeout)
      }
      burstTimeoutsRef.current = []
    }
  }, [])

  if (!isOiia) {
    return null
  }

  return (
    <div className='pointer-events-none fixed inset-0 z-40'>
      {bursts.map((burst) => (
        <div
          className='absolute pointer-events-none oiia-burst'
          key={burst.id}
          style={{
            width: burst.size,
            height: burst.size,
            transform: `translate3d(${burst.x}px, ${burst.y}px, 0)`,
          }}
        >
          <Image
            alt='OIIA birth'
            className='h-full w-full select-none [user-drag:none] [-webkit-user-drag:none]'
            height={burst.size}
            src={burst.src}
            unoptimized
            width={burst.size}
          />
        </div>
      ))}
      {floaters.map((floater, index) => (
        <div
          key={floater.id}
          ref={(node) => {
            nodesRef.current[index] = node
          }}
          className='absolute pointer-events-auto transition-transform duration-150 ease-out oiia-birth'
          onPointerDown={(event) => {
            dragRef.current = {
              id: floater.id,
              offsetX: event.clientX - floater.x,
              offsetY: event.clientY - floater.y,
            }
          }}
          onClick={() => {
            spawnFloater({ x: floater.x, y: floater.y, vx: floater.vx, vy: floater.vy })
          }}
          style={{
            width: floater.size,
            height: floater.size,
            transform: `translate3d(${floater.x}px, ${floater.y}px, 0)`,
          }}
        >
          <Image
            alt='OIIA cat'
            className='h-full w-full select-none [user-drag:none] [-webkit-user-drag:none]'
            height={floater.size}
            priority={index < 2}
            src={GifUrl}
            unoptimized
            width={floater.size}
          />
        </div>
      ))}
    </div>
  )
}
