'use client'

import { type MotionValue, m, useSpring } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useMediaQuery } from 'usehooks-ts'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { MEDIA } from '@/lib/media'
import { cn } from '@/lib/utils'

interface Position {
  x: number
  y: number
}

const SMOOTH_SPRING = { damping: 80, mass: 0.3, stiffness: 1200 }

function usePointerTracking(
  enabled: boolean,
  cursorX: MotionValue<number>,
  cursorY: MotionValue<number>
) {
  const [hasMoved, setHasMoved] = useState(false)
  const [isMoving, setIsMoving] = useState(false)
  const [isOverPointer, setIsOverPointer] = useState(false)
  const [isOverNative, setIsOverNative] = useState(false)
  const lastMousePos = useRef<Position>({ x: 0, y: 0 })
  const velocity = useRef<Position>({ x: 0, y: 0 })
  const lastUpdateTime = useRef(0)
  const movingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!enabled) {
      return
    }

    const updateVelocity = (currentPos: Position) => {
      const currentTime = Date.now()
      const deltaTime = currentTime - lastUpdateTime.current

      if (deltaTime > 0) {
        velocity.current = {
          x: (currentPos.x - lastMousePos.current.x) / deltaTime,
          y: (currentPos.y - lastMousePos.current.y) / deltaTime,
        }
      }

      lastUpdateTime.current = currentTime
      lastMousePos.current = currentPos
    }

    let lastTarget: EventTarget | null = null
    const checkIfOverElement = (e: PointerEvent) => {
      if (e.target === lastTarget) {
        return
      }
      lastTarget = e.target
      if (!(e.target instanceof Element)) {
        return
      }
      setIsOverNative(e.target.closest('[data-native-cursor]') !== null)
      setIsOverPointer(
        e.target.closest('a, button') !== null ||
          window.getComputedStyle(e.target).cursor === 'pointer'
      )
    }

    const smoothMouseMove = (e: PointerEvent) => {
      const currentPos = { x: e.clientX, y: e.clientY }
      updateVelocity(currentPos)
      checkIfOverElement(e)

      const speed = Math.sqrt(velocity.current.x ** 2 + velocity.current.y ** 2)

      cursorX.set(currentPos.x)
      cursorY.set(currentPos.y)

      if (speed > 0.1) {
        setHasMoved(true)
        setIsMoving(true)

        if (movingTimeoutRef.current) {
          clearTimeout(movingTimeoutRef.current)
        }

        movingTimeoutRef.current = setTimeout(() => {
          setIsMoving(false)
          movingTimeoutRef.current = null
        }, 500)
      }
    }

    let rafId: number
    // Taps fire compatibility mousemove events; pointer events say who moved
    const throttledMouseMove = (e: PointerEvent) => {
      if (rafId || e.pointerType !== 'mouse') {
        return
      }

      rafId = requestAnimationFrame(() => {
        smoothMouseMove(e)
        rafId = 0
      })
    }

    window.addEventListener('pointermove', throttledMouseMove, {
      passive: true,
    })

    return () => {
      window.removeEventListener('pointermove', throttledMouseMove)
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
      if (movingTimeoutRef.current) {
        clearTimeout(movingTimeoutRef.current)
      }
    }
  }, [cursorX, cursorY, enabled])

  return { hasMoved, isMoving, isOverNative, isOverPointer }
}

function DefaultCursor({ isOverPointer }: { isOverPointer: boolean }) {
  return (
    <>
      <div className='absolute size-[24px] dark:bg-white dark:blur-[7rem]' />
      <div
        className='pointer-events-none size-[24px] rounded-full border-2 bg-white shadow-sm transition-[opacity,scale] duration-300 ease-out'
        style={{
          opacity: isOverPointer ? 1 : 0,
          scale: isOverPointer ? 1.2 : 1,
        }}
      />
      <div
        className='pointer-events-none absolute top-0 left-0 size-[24px] rounded-full border-2 shadow-sm drop-shadow-sm transition-opacity duration-300 ease-out dark:border-border'
        style={{ opacity: isOverPointer ? 0 : 1 }}
      />
    </>
  )
}

export function SmoothCursor() {
  const finePointer = useMediaQuery(MEDIA.hoverFinePointer)
  const reducedMotion = useReducedMotion()
  const enabled = finePointer && !reducedMotion

  const cursorX = useSpring(0, SMOOTH_SPRING)
  const cursorY = useSpring(0, SMOOTH_SPRING)

  const { hasMoved, isMoving, isOverNative, isOverPointer } =
    usePointerTracking(enabled, cursorX, cursorY)

  if (!(enabled && hasMoved)) {
    return null
  }

  const visible = (isMoving || isOverPointer) && !isOverNative

  return (
    <m.div
      className={cn(
        'pointer-events-none fixed z-99999 translate-x-[-50%] translate-y-[-50%] mix-blend-exclusion transition-[scale,opacity]',
        visible
          ? 'scale-100 opacity-100 duration-300'
          : 'scale-200 opacity-0 duration-700'
      )}
      // left/top, not x/y: the scale-200 fade would also scale an x/y transform and fling
      // the ring down and right instead of blooming in place
      style={{ left: cursorX, top: cursorY }}
    >
      <DefaultCursor isOverPointer={isOverPointer} />
    </m.div>
  )
}
