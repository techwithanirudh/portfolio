'use client'

// Adapted from braydoncoyer.dev by Braydon Coyer (no license, used with
// attribution): https://github.com/braydoncoyer/braydoncoyer.dev/blob/v4/app/components/Timeline.tsx
import { motion, useScroll, useSpring } from 'motion/react'
import { useRef } from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'

/**
 * Draws the timeline's rail in as you scroll: a primary line fills down from
 * the top, reaching each role as that row crosses the middle of the screen.
 * Sits on the dashed rail, so its parent sets the left offset.
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
      <motion.div
        className='absolute inset-y-0 left-0 w-px origin-top -translate-x-1/2 bg-linear-to-b from-primary/10 to-primary'
        style={{ scaleY: progress }}
      />
    </div>
  )
}
