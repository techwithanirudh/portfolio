// Adapted from chanhdai.com (MIT, (c) Chanh Dai): https://github.com/ncdai/chanhdai.com
import type { ComponentProps } from 'react'
import { IconTile } from '@/components/ui/icon-tile'
import { cn } from '@/lib/utils'

export function IntroItemIcon({
  className,
  ...props
}: ComponentProps<typeof IconTile>) {
  return (
    <IconTile
      className={cn(
        'transition-transform duration-300 ease-out group-hover/intro:-rotate-6 group-hover/intro:scale-110 motion-reduce:transition-none',
        className
      )}
      {...props}
    />
  )
}

export function IntroItem({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'group/intro flex items-center gap-4 font-mono text-[13px]',
        className
      )}
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
