'use client'

import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

/** fumadocs' HomeLayout container as a div: its default <main> would wrap the header and footer */
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
