import { cn } from '@/lib/utils'

interface PageFillProps {
  // The layout renders one after every page, it hides when a page places its own
  fallback?: boolean
}

export const PageFill = ({ fallback = false }: PageFillProps) => (
  <div
    aria-hidden
    className={cn(
      'container mx-auto w-full flex-1 border-line border-x',
      // The footer draws its own top rule, a page placed fill closes itself
      fallback
        ? 'in-[#main-content:has([data-page-fill=page])]:hidden'
        : 'screen-line-bottom'
    )}
    data-page-fill={fallback ? 'fallback' : 'page'}
  />
)
