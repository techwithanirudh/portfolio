'use client'

// Adapted from braydoncoyer.dev by Braydon Coyer (no license, used with
// attribution): https://github.com/braydoncoyer/braydoncoyer.dev/blob/v4/app/components/Timeline.tsx
import { m, useScroll, useSpring } from 'motion/react'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'

export function ExperienceRail({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    offset: ['start 50%', 'end 50%'],
    target: ref,
  })
  const progress = useSpring(scrollYProgress, {
    damping: 40,
    restDelta: 0.001,
    stiffness: 260,
  })

  if (reducedMotion) {
    return null
  }

  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-y-0 w-0', className)}
      ref={ref}
    >
      <m.div
        className='mask-fade-bottom absolute inset-y-0 left-0 w-px origin-top -translate-x-1/2 bg-linear-to-b from-primary/10 to-primary'
        style={{ scaleY: progress }}
      />
    </div>
  )
}

export function RailNode({
  children,
  className,
}: {
  children?: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const [passed, setPassed] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element || reducedMotion) {
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          setPassed(entry.boundingClientRect.top < window.innerHeight / 2)
        }
      },
      { rootMargin: '0px 0px -50% 0px' }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [reducedMotion])

  return (
    <div
      className={cn('transition-colors duration-300', className)}
      data-passed={passed || undefined}
      ref={ref}
    >
      {children}
    </div>
  )
}
