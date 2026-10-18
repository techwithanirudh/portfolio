import { typography } from '@/constants/portfolio/colophon'
import { cn } from '@/lib/utils'
import { colophonCardBorderClasses } from './colophon-grid'

export const Typography = () => (
  <div className='grid grid-cols-1 text-left sm:grid-cols-2'>
    <div className='border-border border-b border-dashed bg-card/50 p-6 text-muted-foreground text-sm sm:col-span-2'>
      <p>
        Geist Sans sets most of the interface, and Geist Mono sets code and
        labels.
      </p>
    </div>
    {typography.map((item, index) => (
      <div
        className={cn(
          'flex items-center gap-2 bg-card/50 p-6 text-foreground text-sm transition-colors hover:bg-card/80',
          colophonCardBorderClasses(index, 2),
          item.className
        )}
        key={item.label}
      >
        {item.label}
      </div>
    ))}
  </div>
)
