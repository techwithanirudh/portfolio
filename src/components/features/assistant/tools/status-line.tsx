import type { ReactNode } from 'react'
import { Shimmer } from '@/components/ai-elements/shimmer'
import { Icons } from '@/components/icons/icons'
import type { SvgIcon } from '@/components/icons/utils'

export const ToolPendingLine = ({
  children,
  icon: Icon,
}: {
  children: string
  icon: SvgIcon
}) => (
  <p className='flex items-center gap-2 text-muted-foreground text-sm'>
    <Icon aria-hidden className='size-4 shrink-0' />
    <Shimmer as='span'>{children}</Shimmer>
  </p>
)

export const ToolDoneLine = ({
  children,
  icon: Icon,
}: {
  children: ReactNode
  icon: SvgIcon
}) => (
  <p className='flex items-center gap-2 text-sm'>
    <Icon aria-hidden className='size-4 shrink-0 text-muted-foreground' />
    <span>{children}</span>
  </p>
)

export const ToolWarningLine = ({ children }: { children: ReactNode }) => (
  <p className='flex items-center gap-2 text-muted-foreground text-xs'>
    <Icons.warning aria-hidden className='size-3.5' />
    {children}
  </p>
)
