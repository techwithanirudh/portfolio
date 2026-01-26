import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

type ProseProps = ComponentProps<'div'>

export const Prose = ({ className, ...props }: ProseProps) => (
  <div className={cn('prose dark:prose-invert', className)} {...props} />
)
