'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

const CELL = 14
const GAP = 2
const RADIUS = 5
const DECAY = 0.94
const CUTOFF = 0.01
const COLOR_A = [139, 92, 246] // violet
const COLOR_B = [56, 189, 248] // azure

// Cheap deterministic per-cell noise so the static field has a pixel-art grain.
const hash = (x: number, y: number) => {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43_758.5453
  return n - Math.floor(n)
}

const mix = (t: number) =>
  COLOR_A.map((a, i) => Math.round(a + ((COLOR_B[i] ?? a) - a) * t)).join(',')

interface PixelHoverProps {
  className?: string
}

/**
 * A grid of pixels that forms a soft gradient anchored to the bottom-right
 * corner. Moving the cursor over it lights pixels up, then they fade out.
 * Static (drawn once) for reduced-motion users and touch devices.
 */
export const PixelHover = ({ className }: PixelHoverProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const parent = canvas?.parentElement
    const ctx = canvas?.getContext('2d')
    if (!(canvas && parent && ctx)) {
      return
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')

    let cols = 0
    let rows = 0
    let base = new Float32Array(0)
    let heat = new Float32Array(0)
    let frame = 0
    let dpr = 1

    const draw = () => {
      const dark = document.documentElement.classList.contains('dark')
      const strength = dark ? 1 : 0.7
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x
          const alpha = Math.min(1, (base[i] ?? 0) + (heat[i] ?? 0)) * strength
          if (alpha < 0.02) {
            continue
          }
          ctx.fillStyle = `rgba(${mix(x / cols)},${alpha})`
          ctx.fillRect(
            x * CELL * dpr,
            y * CELL * dpr,
            (CELL - GAP) * dpr,
            (CELL - GAP) * dpr
          )
        }
      }
    }

    const buildBase = () => {
      base = new Float32Array(cols * rows)
      heat = new Float32Array(cols * rows)
      const diag = Math.hypot(cols, rows)
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          // Distance from the bottom-right corner drives the fade.
          const d = Math.hypot(cols - x, rows - y) / diag
          const fade = Math.max(0, 1 - d * 1.5)
          base[y * cols + x] = fade * fade * (0.15 + hash(x, y) * 0.45)
        }
      }
    }

    const resize = () => {
      const { width, height } = parent.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      cols = Math.ceil(width / CELL)
      rows = Math.ceil(height / CELL)
      buildBase()
      draw()
    }

    const tick = () => {
      let alive = false
      for (let i = 0; i < heat.length; i++) {
        if ((heat[i] ?? 0) > CUTOFF) {
          heat[i] = (heat[i] ?? 0) * DECAY
          alive = true
        } else {
          heat[i] = 0
        }
      }
      draw()
      frame = alive ? requestAnimationFrame(tick) : 0
    }

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      ) {
        return
      }
      const cx = (event.clientX - rect.left) / CELL
      const cy = (event.clientY - rect.top) / CELL
      for (let y = Math.floor(cy - RADIUS); y <= cy + RADIUS; y++) {
        for (let x = Math.floor(cx - RADIUS); x <= cx + RADIUS; x++) {
          if (x < 0 || y < 0 || x >= cols || y >= rows) {
            continue
          }
          const falloff = 1 - Math.hypot(x - cx, y - cy) / RADIUS
          if (falloff > 0) {
            const i = y * cols + x
            heat[i] = Math.max(heat[i] ?? 0, falloff * (0.5 + hash(x, y) * 0.5))
          }
        }
      }
      if (!frame) {
        frame = requestAnimationFrame(tick)
      }
    }

    const interactive = !reducedMotion.matches && finePointer.matches
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(parent)
    if (interactive) {
      // Window-level so hero text and buttons above the canvas still count.
      window.addEventListener('pointermove', onMove, { passive: true })
    }

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return (
    <canvas
      aria-hidden
      className={cn('pointer-events-none size-full', className)}
      ref={canvasRef}
    />
  )
}
