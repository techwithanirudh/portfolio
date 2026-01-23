import { typography } from '@/constants/portfolio/colophon'
import { cn } from '@/lib/utils'

export const Typography = () => (
  <div className='flex flex-col divide-y divide-dashed divide-border text-left'>
    <div className='bg-card/50 p-6 text-muted-foreground text-sm'>
      <p>
        Geist Sans anchors the interface while Geist Mono keeps code and labels
        crisp.
      </p>
    </div>
    <div className='bg-card/50 p-6'>
      <div className='grid grid-cols-1 divide-y divide-dashed divide-border border border-border/70 border-dashed text-center sm:grid-cols-2 sm:divide-x sm:divide-y-0'>
        {typography.map((item) => (
          <div
            className={cn(
              'flex items-center justify-center px-4 py-6 text-base text-foreground transition-colors hover:bg-card/80 sm:text-lg',
              item.className
            )}
            key={item.label}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  </div>
)
