import type { ReactNode } from 'react'
import { Section } from '@/components/layout/sections'
import { cn } from '@/lib/utils'

interface SectionBodyProps {
  children: ReactNode
  className?: string
  /**
   * Take the leftover viewport height in place of the layout's PageFill, so
   * whatever ends the body (like comments) sits right above the footer
   */
  grow?: boolean
  sectionClassName?: string
}

export const SectionBody = ({
  children,
  className,
  grow = false,
  sectionClassName,
}: SectionBodyProps) => (
  <Section
    className={cn('h-full', grow && 'flex-1', className)}
    data-page-fill={grow ? 'page' : undefined}
    sectionClassName={cn(
      'flex flex-1',
      grow && 'flex-col *:flex *:flex-1 *:flex-col',
      sectionClassName
    )}
  >
    {children}
  </Section>
)
