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
      className={cn(
        buttonVariants({ shape: 'square' }),
        'w-full py-8 focus-visible:outline-2 focus-visible:outline-primary-foreground focus-visible:outline-solid focus-visible:-outline-offset-6 focus-visible:ring-0 active:scale-none active:opacity-80'
      )}
      href={href}
    >
      {children}
      <Icons.arrowRight className='icon-arrow-button size-5' />
    </Link>
  </ViewAnimation>
)
