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
}

const GifUrl = 'https://media.tenor.com/8VuZc8I8f7EAAAAj/oiia-cat.gif'
const AudioOptions = [
  'https://www.youtube.com/embed/IxX_QHay02M?autoplay=1',
  'https://www.youtube.com/embed/A2LGuBlDloQ?autoplay=1&list=RDA2LGuBlDloQ&start_radio=1',
] as const
const FloatersCount = 4
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
  }
}

export function OiiaFloaters() {
  const { mode } = useOiiaMode()
  const isOiia = mode === 'oiia'
  const nodesRef = useRef<Array<HTMLDivElement | null>>([])
  const rafRef = useRef<number | null>(null)
  const floatersRef = useRef<Floater[]>([])
  const idRef = useRef(0)
  const [floaters, setFloaters] = useState<Floater[]>([])
  const [playCount, setPlayCount] = useState(0)
  const [audioSrc, setAudioSrc] = useState<string | null>(null)
  const dragRef = useRef<{
    id: number | null
    offsetX: number
    offsetY: number
  }>({ id: null, offsetX: 0, offsetY: 0 })

  const resetFloaters = () => {
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
  }

  const spawnFloater = useCallback(() => {
    if (typeof window === 'undefined') {
      return
    }
    const next = createFloater(
      idRef.current,
      window.innerWidth,
      window.innerHeight
    )
    idRef.current += 1
    setFloaters((prev) => {
      const updated = [...prev, next]
      floatersRef.current = updated
      return updated
    })
  }, [])

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

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [floaters, isOiia])

  useEffect(() => {
    if (isOiia) {
      resetFloaters()
    }
  }, [isOiia])

  useEffect(() => {
    const handleSpawn = () => {
      spawnFloater()
      const choice =
        AudioOptions[Math.floor(Math.random() * AudioOptions.length)]
      setAudioSrc(`${choice}&cb=${Date.now()}`)
      setPlayCount((count) => count + 1)
    }

    window.addEventListener('oiia:spawn', handleSpawn as EventListener)
    return () => {
      window.removeEventListener('oiia:spawn', handleSpawn as EventListener)
    }
  }, [spawnFloater])

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

  return (
    <div className='pointer-events-none fixed inset-0 z-40'>
      <div className='sr-only'>
        {playCount > 0 && audioSrc ? (
          <iframe
            allow='autoplay; encrypted-media'
            aria-hidden='true'
            key={playCount}
            src={audioSrc}
            title='oiia-audio'
          />
        ) : null}
      </div>
      {isOiia
        ? floaters.map((floater, index) => (
            <div
              key={floater.id}
              ref={(node) => {
                nodesRef.current[index] = node
              }}
              className='absolute pointer-events-auto transition-transform duration-150 ease-out'
              onPointerDown={(event) => {
                dragRef.current = {
                  id: floater.id,
                  offsetX: event.clientX - floater.x,
                  offsetY: event.clientY - floater.y,
                }
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
          ))
        : null}
    </div>
  )
}
