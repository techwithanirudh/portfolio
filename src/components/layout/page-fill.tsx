import { cn } from '@/lib/utils'

interface PageFillProps {
  // The layout renders a fallback after every page; it steps aside when the
  // page places its own fill
  fallback?: boolean
}

// Soaks up the leftover viewport height on short pages, keeping the side
// rules running and the footer at the bottom. A page renders one where the
// gap should go (e.g. above a closing section)
export const PageFill = ({ fallback = false }: PageFillProps) => (
  <div
    aria-hidden
    className={cn(
      'container mx-auto w-full flex-1 border-line border-x',
      fallback && 'in-[#main-content:has([data-page-fill=page])]:hidden'
    )}
    data-page-fill={fallback ? 'fallback' : 'page'}
  />
)
