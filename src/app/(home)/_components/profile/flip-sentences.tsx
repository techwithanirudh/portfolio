'use client'

// Adapted from chanhdai.com (MIT, (c) Chanh Dai): https://github.com/ncdai/chanhdai.com
import { useInView, usePageInView } from 'motion/react'
import { useRef } from 'react'
import { TextFlip } from '@/components/text-flip'
import { cn } from '@/lib/utils'

export function FlipSentences({
  children,
  className,
}: {
  children: readonly string[]
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isPageInView = usePageInView()
  const isInView = useInView(ref)

  return (
    <div className={cn('flex items-center', className)} ref={ref}>
      <span aria-hidden className='mr-2 font-mono text-primary text-sm'>
        &gt;
      </span>
      <TextFlip
        className='text-balance font-mono text-muted-foreground text-sm'
        interval={3}
        play={isPageInView && isInView}
      >
        {[...children]}
      </TextFlip>
    </div>
  )
}
