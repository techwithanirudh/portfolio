import Link from 'next/link'
import type { ReactNode } from 'react'
import { Icons } from '@/components/icons/icons'
import { buttonVariants } from '@/components/ui/button'
import { ViewAnimation } from '@/components/view-animation'

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
      className={buttonVariants({
        className: 'w-full py-6 ring-inset active:scale-none active:opacity-80',
        shape: 'square',
      })}
      href={href}
    >
      {children}
      <Icons.arrowRight className='icon-arrow-button size-4' />
    </Link>
  </ViewAnimation>
)
