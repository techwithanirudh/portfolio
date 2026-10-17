import Link from 'next/link'
import type { ReactNode } from 'react'
import { Icons } from '@/components/icons/icons'
import { buttonVariants } from '@/components/ui/button-variants'
import { ViewAnimation } from '@/components/view-animation'
import { cn } from '@/lib/utils'

export const SectionMoreLink = ({
  children,
  delay,
  href,
}: {
  children: ReactNode
  delay?: number
  href: string
}) => (
  <ViewAnimation className='border-border border-t border-dashed' delay={delay}>
    <Link
      // The ring sits inside the full width bar, where the usual ring color
      // matches the fill in dark mode, so it takes the label color instead
      className={cn(
        buttonVariants({ shape: 'square' }),
        'w-full py-8 ring-inset focus-visible:ring-primary-foreground active:scale-none active:opacity-80'
      )}
      href={href}
    >
      {children}
      <Icons.arrowRight className='icon-arrow-button size-5' />
    </Link>
  </ViewAnimation>
)
