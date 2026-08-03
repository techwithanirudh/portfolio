import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

type ScrollFadeEffectProps = ComponentProps<'div'> & {
  orientation?: 'horizontal' | 'vertical'
}

export function ScrollFadeEffect({
  className,
  orientation = 'vertical',
  ...props
}: ScrollFadeEffectProps) {
  return (
    <div
      className={cn(
        orientation === 'horizontal'
          ? 'scroll-fade-effect-x overflow-x-auto'
          : 'scroll-fade-effect-y overflow-y-auto',
        className
      )}
      {...props}
    />
  )
}
