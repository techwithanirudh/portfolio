'use client'

import {
  GrainGradient,
  type PaperShaderElement,
} from '@paper-design/shaders-react'
import { useTheme } from 'next-themes'
import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'

const PALETTES = {
  dark: ['#6d4cff', '#a78bfa', '#38bdf8', '#2563eb'],
  light: ['#8b5cf6', '#c4b5fd', '#7dd3fc', '#60a5fa'],
}

const MAX_PIXEL_RATIO = 1.5

const FADES = {
  bottom:
    '[mask-image:radial-gradient(ellipse_70%_90%_at_50%_100%,black_20%,transparent_75%)]',
  corner:
    '[mask-image:radial-gradient(ellipse_75%_105%_at_100%_100%,black_25%,transparent_80%)]',
}

export function GrainBackdrop({
  className,
  fade = 'corner',
}: {
  className?: string
  fade?: keyof typeof FADES
}) {
  const { resolvedTheme } = useTheme()
  const colors = PALETTES[resolvedTheme === 'light' ? 'light' : 'dark']
  const reduceMotion = useReducedMotion()
  const ref = useRef<PaperShaderElement>(null)
  const [maxPixelCount, setMaxPixelCount] = useState<number>()

  useEffect(() => {
    const element = ref.current
    if (!element) {
      return
    }
    const observer = new ResizeObserver(([entry]) => {
      const size = entry?.borderBoxSize[0]
      if (size) {
        setMaxPixelCount(
          Math.max(1, size.inlineSize * size.blockSize * MAX_PIXEL_RATIO ** 2)
        )
      }
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <GrainGradient
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 opacity-80 dark:opacity-100',
        // Eases in from nothing to its own opacity while WebGL spins up,
        // instead of popping in on the first frame it draws
        'fade-in animate-in fill-mode-both delay-150 duration-1400 ease-out motion-reduce:animate-none',
        FADES[fade],
        className
      )}
      colorBack='#00000000'
      colors={colors}
      intensity={0.5}
      maxPixelCount={maxPixelCount}
      minPixelRatio={1}
      noise={0.35}
      ref={ref}
      shape='wave'
      softness={1}
      speed={reduceMotion ? 0 : 0.3}
    />
  )
}
