import { typography } from '@/constants/portfolio/colophon'
import { cn } from '@/lib/utils'

export const Typography = () => (
  <div className='grid grid-cols-1 text-left sm:grid-cols-2'>
    <div className='border-border border-b border-dashed bg-card/50 p-6 text-muted-foreground text-sm sm:col-span-2'>
      <p>
        Geist Sans anchors the interface while Geist Mono keeps code and labels
        crisp.
      </p>
    </div>
    {typography.map((item, index) => (
      <div
        className={cn(
          'flex items-center gap-2 border-border border-dashed bg-card/50 p-6 text-foreground text-sm transition-colors hover:bg-card/80',
          index > 0 && 'border-t',
          index < 2 && 'sm:border-t-0',
          index % 2 === 0 && 'sm:border-r',
          item.className
        )}
        key={item.label}
      >
        {item.label}
      </div>
    ))}
  </div>
)
