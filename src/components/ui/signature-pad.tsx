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

function getThemeColor(theme: string | undefined): string {
  return theme === 'dark' ? '#fff' : '#000'
}

const SIGNATURE_OUTPUT_WIDTH = 560
const SIGNATURE_OUTPUT_HEIGHT = 252

function exportCanvas(source: HTMLCanvasElement): string {
  const temp = document.createElement('canvas')
  temp.width = source.width
  temp.height = source.height
  const tempCtx = temp.getContext('2d')
  if (!tempCtx) {
    return source.toDataURL('image/png')
  }

  tempCtx.drawImage(source, 0, 0)
  tempCtx.globalCompositeOperation = 'source-in'
  tempCtx.fillStyle = '#000'
  tempCtx.fillRect(0, 0, temp.width, temp.height)

  const output = document.createElement('canvas')
  output.width = SIGNATURE_OUTPUT_WIDTH
  output.height = SIGNATURE_OUTPUT_HEIGHT
  const outputCtx = output.getContext('2d')
  if (!outputCtx) {
    return temp.toDataURL('image/png')
  }

  const scale = Math.min(output.width / temp.width, output.height / temp.height)
  const drawWidth = temp.width * scale
  const drawHeight = temp.height * scale
  const dx = (output.width - drawWidth) / 2
  const dy = (output.height - drawHeight) / 2

  outputCtx.drawImage(temp, dx, dy, drawWidth, drawHeight)
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
  const drawing = useRef(false)
  const lastPoint = useRef<{ x: number; y: number } | null>(null)
  const strokes = useRef(0)
  const color = useRef(getThemeColor(resolvedTheme))
  const snapshots = useRefHistory<ImageData>()

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
    const ctx = canvas?.getContext('2d')
    if (canvas && ctx) {
      snapshots.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
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
    snapshots.clear()
    onClear?.()
  }, [onClear, snapshots])

  const undo = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!(canvas && ctx && snapshots.canUndo())) {
      return
    }
    const snapshot = snapshots.undo()
    if (snapshot) {
      ctx.putImageData(snapshot, 0, 0)
      strokes.current -= 1
      onChange?.(exportCanvas(canvas))
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      strokes.current = 0
      onClear?.()
    }
  }, [onChange, onClear, snapshots])

  const redo = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!(canvas && ctx && snapshots.canRedo())) {
      return
    }
    const snapshot = snapshots.redo()
    if (!snapshot) {
      return
    }
    ctx.putImageData(snapshot, 0, 0)
    strokes.current += 1
    onChange?.(exportCanvas(canvas))
  }, [onChange, snapshots])

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
