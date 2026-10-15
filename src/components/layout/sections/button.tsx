import Link from 'next/link'
import type { ComponentProps } from 'react'
import { Icons } from '@/components/icons/icons'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Full-width square button that sits flush on a section's bottom edge,
// after chanhdai.com's PanelButton (MIT, (c) Chanh Dai)
export function SectionButton({
  className,
  children,
  ...props
}: ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        buttonVariants({ shape: 'square', variant: 'default' }),
        'h-auto w-full py-5 ring-0 active:scale-100 active:opacity-90',
        className
      )}
      data-slot='section-button'
      {...props}
    >
      {children}
      <Icons.arrowRight className='icon-arrow-button size-4' />
    </Link>
  )
}
