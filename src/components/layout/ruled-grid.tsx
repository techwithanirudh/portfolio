import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface RuledGridProps {
  as?: 'div' | 'ol' | 'ul'
  children: ReactNode
  className?: string
}

// Cells draw their own right and bottom rules and the outer edges get clipped,
// so the rails and the next section line do the framing
export function RuledGrid({
  as: Component = 'div',
  children,
  className,
}: RuledGridProps) {
  return (
    <div className='overflow-hidden'>
      <Component
        className={cn(
          '-mr-px -mb-px grid bg-dashed [&>*]:border-line [&>*]:border-r [&>*]:border-b',
          className
        )}
      >
        {children}
      </Component>
    </div>
  )
}
