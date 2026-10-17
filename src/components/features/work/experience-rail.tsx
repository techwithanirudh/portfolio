'use client'

// Adapted from braydoncoyer.dev by Braydon Coyer (no license, used with
// attribution): https://github.com/braydoncoyer/braydoncoyer.dev/blob/v4/app/components/Timeline.tsx
import { motion, useScroll, useSpring } from 'motion/react'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'

/**
 * Draws the timeline's rail in as you scroll: a primary line fills down from
 * the top, reaching each role as that row crosses the middle of the screen.
 * Sits on the full length of the dashed rail, so its parent sets the left
 * offset.
 */
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
      {/* Fades out over the same last 6rem as the dashed rail it sits on */}
      <motion.div
        className='absolute inset-y-0 left-0 w-px origin-top -translate-x-1/2 bg-linear-to-b from-primary/10 to-primary [mask-image:linear-gradient(to_bottom,#000_calc(100%-6rem),transparent)]'
        style={{ scaleY: progress }}
      />
    </div>
  )
}

/**
 * A node on the rail that turns primary once the fill has reached it, which
 * is when it crosses the middle of the screen, the same line the fill's tip
 * tracks. Stays as drawn when motion is reduced, since there's no fill then.
 */
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
    // The root is the top half of the screen, so this fires as the node
    // crosses the middle in either direction
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
