'use client'

import { GrainGradient } from '@paper-design/shaders-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

const PALETTES = {
  dark: ['#6d4cff', '#a78bfa', '#38bdf8', '#2563eb'],
  light: ['#8b5cf6', '#c4b5fd', '#7dd3fc', '#60a5fa'],
}

/**
 * Soft purple/azure grain blob pinned to the bottom-right corner, the same
 * look as the old static hero image, but animated with Paper Shaders.
 */
export function HeroGradient({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme()
  const colors = PALETTES[resolvedTheme === 'light' ? 'light' : 'dark']

  return (
    <GrainGradient
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 opacity-80 [mask-image:radial-gradient(ellipse_75%_105%_at_100%_100%,black_25%,transparent_80%)] dark:opacity-100',
        className
      )}
      colorBack='#00000000'
      colors={colors}
      intensity={0.5}
      noise={0.35}
      shape='wave'
      softness={1}
      speed={0.3}
    />
  )
}
