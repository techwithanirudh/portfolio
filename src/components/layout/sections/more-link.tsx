import Link from 'next/link'
import type { ReactNode } from 'react'
import { Icons } from '@/components/icons/icons'
import { buttonVariants } from '@/components/ui/button'
import { ViewAnimation } from '@/components/view-animation'

// The full width bar that closes a home section and leads to its full page
export const SectionMoreLink = ({
  children,
  delay,
  href,
}: {
  children: ReactNode
  delay?: number
  href: string
}) => (
  <ViewAnimation delay={delay}>
    <Link
      className={buttonVariants({
        className:
          'w-full border-border border-t border-dashed py-6 active:scale-none active:opacity-80',
        shape: 'square',
      })}
      href={href}
    >
      {children}
      <Icons.arrowRight className='icon-arrow-button size-4' />
    </Link>
  </ViewAnimation>
)
