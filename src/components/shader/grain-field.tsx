'use client'

import { GrainGradient } from '@paper-design/shaders-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

// Paper's grain gradient (https://shaders.paper.design/grain-gradient) tuned
// to the same violet to azure palette as the dither field. The back colour is
// transparent so the page background shows through in both themes.
const PALETTE = {
  dark: ['#6b5cf0', '#9d8cf5', '#6bd4f2', '#2b3aa8'],
  light: ['#8a76ee', '#c3b6fa', '#7fd0f5', '#5d6fe0'],
} as const

export function GrainField({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div aria-hidden className={className} />
  }

  return (
    <GrainGradient
      aria-hidden
      className={cn('pointer-events-none', className)}
      colorBack='#00000000'
      colors={[...PALETTE[resolvedTheme === 'light' ? 'light' : 'dark']]}
      intensity={0.3}
      noise={0.35}
      shape='wave'
      softness={0.8}
      speed={0.6}
    />
  )
}
