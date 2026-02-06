'use client'

import { Eraser } from 'lucide-react'
import { useTheme } from 'next-themes'
import {
  type PointerEvent,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface SignaturePadHandle {
  clear: () => void
  isEmpty: () => boolean
  toDataURL: () => string
}

interface SignaturePadProps {
  onChange?: (dataUrl: string) => void
  onClear?: () => void
  strokeWidth?: number
  disabled?: boolean
  className?: string
  ref?: React.Ref<SignaturePadHandle>
}

function getThemeColor(theme: string | undefined): string {
  return theme === 'dark' ? '#fff' : '#000'
}

function exportCanvas(source: HTMLCanvasElement): string {
  const canvas = document.createElement('canvas')
  canvas.width = source.width
  canvas.height = source.height
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return source.toDataURL('image/png')
  }
  ctx.drawImage(source, 0, 0)
  ctx.globalCompositeOperation = 'source-in'
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/png')
}

export function SignaturePad({
  onChange,
  onClear,
  strokeWidth = 2,
  disabled = false,
  className,
  ref,
}: SignaturePadProps) {
  const { resolvedTheme } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const drawing = useRef(false)
  const lastPoint = useRef<{ x: number; y: number } | null>(null)
  const strokes = useRef(0)
  const color = useRef(getThemeColor(resolvedTheme))

  useEffect(() => {
    color.current = getThemeColor(resolvedTheme)

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!(canvas && ctx) || strokes.current === 0) {
      return
    }

    ctx.save()
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.globalCompositeOperation = 'source-in'
    ctx.fillStyle = color.current
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.restore()
  }, [resolvedTheme])

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!(canvas && container)) {
      return
    }

    const rect = container.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    const w = Math.round(rect.width * dpr)
    const h = Math.round(rect.height * dpr)

    if (canvas.width === w && canvas.height === h) {
      return
    }

    const ctx = canvas.getContext('2d')
    const snapshot =
      ctx && strokes.current > 0
        ? ctx.getImageData(0, 0, canvas.width, canvas.height)
        : null

    canvas.width = w
    canvas.height = h
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`

    if (!ctx) {
      return
    }

    ctx.scale(dpr, dpr)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    if (snapshot) {
      ctx.putImageData(snapshot, 0, 0)
    }
  }, [])

  useEffect(() => {
    setupCanvas()
    const container = containerRef.current
    if (!container) {
      return
    }
    const observer = new ResizeObserver(setupCanvas)
    observer.observe(container)
    return () => observer.disconnect()
  }, [setupCanvas])

  // Pointer helpers
  const pos = (e: PointerEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) {
      return null
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const onPointerDown = (e: PointerEvent) => {
    if (disabled) {
      return
    }
    e.preventDefault()
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    const p = pos(e)
    if (!(canvas && ctx && p)) {
      return
    }

    canvas.setPointerCapture(e.pointerId)
    drawing.current = true
    strokes.current += 1
    lastPoint.current = p

    ctx.fillStyle = color.current
    ctx.beginPath()
    ctx.arc(p.x, p.y, strokeWidth / 2, 0, Math.PI * 2)
    ctx.fill()
  }

  const onPointerMove = (e: PointerEvent) => {
    if (!drawing.current) {
      return
    }
    e.preventDefault()
    const ctx = canvasRef.current?.getContext('2d')
    const p = pos(e)
    if (!(ctx && p && lastPoint.current)) {
      return
    }

    ctx.strokeStyle = color.current
    ctx.lineWidth = strokeWidth
    ctx.beginPath()
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y)
    ctx.lineTo(p.x, p.y)
    ctx.stroke()
    lastPoint.current = p
  }

  const onPointerUp = () => {
    if (!drawing.current) {
      return
    }
    drawing.current = false
    lastPoint.current = null
    const canvas = canvasRef.current
    if (canvas) {
      onChange?.(exportCanvas(canvas))
    }
  }

  const clear = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!(ctx && canvasRef.current)) {
      return
    }
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    strokes.current = 0
    onClear?.()
  }, [onClear])

  useImperativeHandle(
    ref,
    () => ({
      clear,
      isEmpty: () => strokes.current === 0,
      toDataURL: () =>
        canvasRef.current ? exportCanvas(canvasRef.current) : '',
    }),
    [clear]
  )

  return (
    <div
      className={cn('relative h-[200px] w-full', className)}
      ref={containerRef}
    >
      <canvas
        className={cn(
          'size-full rounded-md border border-input bg-background shadow-xs',
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-crosshair'
        )}
        onPointerDown={onPointerDown}
        onPointerLeave={onPointerUp}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        ref={canvasRef}
        style={{ touchAction: 'none' }}
      />
      <Button
        aria-label='Clear signature'
        className='absolute top-2 right-2'
        disabled={disabled}
        onClick={clear}
        size='icon'
        type='button'
        variant='ghost'
      >
        <Eraser className='size-4' />
      </Button>
    </div>
  )
}
