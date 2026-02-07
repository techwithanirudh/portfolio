'use client'

import { Eraser, Redo2, Undo2 } from 'lucide-react'
import { useTheme } from 'next-themes'
import {
  type PointerEvent,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'

import { Button } from '@/components/ui/button'
import { useRefHistory } from '@/hooks/use-ref-history'
import { cn } from '@/lib/utils'

interface Point {
  x: number
  y: number
}

export interface SignaturePadHandle {
  clear: () => void
  isEmpty: () => boolean
  toDataURL: () => string
  undo: () => void
  redo: () => void
}

interface SignaturePadProps {
  onChange?: (dataUrl: string) => void
  onClear?: () => void
  strokeWidth?: number
  disabled?: boolean
  className?: string
  ref?: React.Ref<SignaturePadHandle>
}

const OUTPUT_WIDTH = 560
const OUTPUT_HEIGHT = 252

function getStrokeColor(theme: string | undefined): string {
  return theme === 'dark' ? '#fff' : '#000'
}

function exportCanvas(source: HTMLCanvasElement): string {
  const normalized = document.createElement('canvas')
  normalized.width = source.width
  normalized.height = source.height
  const nCtx = normalized.getContext('2d')
  if (!nCtx) {
    return source.toDataURL('image/png')
  }

  nCtx.drawImage(source, 0, 0)
  nCtx.globalCompositeOperation = 'source-in'
  nCtx.fillStyle = '#000'
  nCtx.fillRect(0, 0, normalized.width, normalized.height)

  const output = document.createElement('canvas')
  output.width = OUTPUT_WIDTH
  output.height = OUTPUT_HEIGHT
  const oCtx = output.getContext('2d')
  if (!oCtx) {
    return normalized.toDataURL('image/png')
  }

  const scale = Math.min(
    OUTPUT_WIDTH / normalized.width,
    OUTPUT_HEIGHT / normalized.height
  )
  const w = normalized.width * scale
  const h = normalized.height * scale
  oCtx.drawImage(
    normalized,
    (OUTPUT_WIDTH - w) / 2,
    (OUTPUT_HEIGHT - h) / 2,
    w,
    h
  )

  return output.toDataURL('image/png')
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
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const isDrawing = useRef(false)
  const lastPoint = useRef<Point | null>(null)
  const strokes = useRef(0)
  const strokeColor = useRef(getStrokeColor(resolvedTheme))
  const history = useRefHistory<ImageData>()

  useEffect(() => {
    strokeColor.current = getStrokeColor(resolvedTheme)

    const canvas = canvasRef.current
    const ctx = ctxRef.current
    if (!(canvas && ctx) || strokes.current === 0) {
      return
    }

    ctx.save()
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.globalCompositeOperation = 'source-in'
    ctx.fillStyle = strokeColor.current
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

    const ctx = ctxRef.current
    const snapshot =
      ctx && strokes.current > 0
        ? ctx.getImageData(0, 0, canvas.width, canvas.height)
        : null

    canvas.width = w
    canvas.height = h
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`

    const newCtx = canvas.getContext('2d')
    if (!newCtx) {
      return
    }

    ctxRef.current = newCtx
    newCtx.scale(dpr, dpr)
    newCtx.lineCap = 'round'
    newCtx.lineJoin = 'round'

    if (snapshot) {
      newCtx.putImageData(snapshot, 0, 0)
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

  const getPoint = (e: PointerEvent): Point | null => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) {
      return null
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const commitStroke = () => {
    const canvas = canvasRef.current
    const ctx = ctxRef.current
    if (!(canvas && ctx)) {
      return
    }

    history.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
    onChange?.(exportCanvas(canvas))
  }

  const onPointerDown = (e: PointerEvent) => {
    if (disabled) {
      return
    }
    e.preventDefault()

    const canvas = canvasRef.current
    const ctx = ctxRef.current
    const point = getPoint(e)
    if (!(canvas && ctx && point)) {
      return
    }

    canvas.setPointerCapture(e.pointerId)
    isDrawing.current = true
    strokes.current += 1
    lastPoint.current = point

    ctx.fillStyle = strokeColor.current
    ctx.beginPath()
    ctx.arc(point.x, point.y, strokeWidth / 2, 0, Math.PI * 2)
    ctx.fill()
  }

  const onPointerMove = (e: PointerEvent) => {
    if (!isDrawing.current) {
      return
    }
    e.preventDefault()

    const ctx = ctxRef.current
    const point = getPoint(e)
    const prev = lastPoint.current
    if (!(ctx && point && prev)) {
      return
    }

    ctx.strokeStyle = strokeColor.current
    ctx.lineWidth = strokeWidth
    ctx.beginPath()
    ctx.moveTo(prev.x, prev.y)
    ctx.lineTo(point.x, point.y)
    ctx.stroke()
    lastPoint.current = point
  }

  const onPointerUp = () => {
    if (!isDrawing.current) {
      return
    }
    isDrawing.current = false
    lastPoint.current = null
    commitStroke()
  }

  const clear = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = ctxRef.current
    if (!(canvas && ctx)) {
      return
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    strokes.current = 0
    history.clear()
    onClear?.()
  }, [onClear, history])

  const undo = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = ctxRef.current
    if (!(canvas && ctx && history.canUndo())) {
      return
    }

    const snapshot = history.undo()
    if (snapshot) {
      ctx.putImageData(snapshot, 0, 0)
      strokes.current -= 1
      onChange?.(exportCanvas(canvas))
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      strokes.current = 0
      onClear?.()
    }
  }, [onChange, onClear, history])

  const redo = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = ctxRef.current
    if (!(canvas && ctx && history.canRedo())) {
      return
    }

    const snapshot = history.redo()
    if (!snapshot) {
      return
    }

    ctx.putImageData(snapshot, 0, 0)
    strokes.current += 1
    onChange?.(exportCanvas(canvas))
  }, [onChange, history])

  useImperativeHandle(
    ref,
    () => ({
      clear,
      isEmpty: () => strokes.current === 0,
      toDataURL: () =>
        canvasRef.current ? exportCanvas(canvasRef.current) : '',
      undo,
      redo,
    }),
    [clear, undo, redo]
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
      <div className='absolute top-2 left-2 flex gap-1'>
        <Button
          aria-label='Undo stroke'
          disabled={disabled}
          onClick={undo}
          size='icon'
          type='button'
          variant='ghost'
        >
          <Undo2 className='size-4' />
        </Button>
        <Button
          aria-label='Redo stroke'
          disabled={disabled}
          onClick={redo}
          size='icon'
          type='button'
          variant='ghost'
        >
          <Redo2 className='size-4' />
        </Button>
      </div>
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
