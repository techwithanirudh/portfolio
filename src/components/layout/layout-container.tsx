'use client'

import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

/**
 * fumadocs' HomeLayout container, as a div: its default is a <main>, which
 * puts the header and footer inside the main landmark. The page's own <main>
 * sits inside, between the banner and the contentinfo
 */
export const LayoutContainer = ({
  className,
  ...props
}: Omit<ComponentProps<'main'>, 'ref'>) => (
  <div
    id='nd-home-layout'
    {...props}
    className={cn('flex flex-1 flex-col [--fd-layout-width:1400px]', className)}
  />
)
