// Adapted from chanhdai.com (MIT, (c) Chanh Dai): https://github.com/ncdai/chanhdai.com
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export { IconTile as IntroItemIcon } from '@/components/ui/icon-tile'

export function IntroItem({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex items-center gap-4 font-mono text-[13px]', className)}
      {...props}
    />
  )
}

export function IntroItemContent({ className, ...props }: ComponentProps<'p'>) {
  return <p className={cn('text-balance', className)} {...props} />
}

export function IntroItemLink({ className, ...props }: ComponentProps<'a'>) {
  return (
    <a
      className={cn('link-underline', className)}
      rel='noopener noreferrer'
      target='_blank'
      {...props}
    />
  )
}
