import { cn } from '@/lib/utils'

const palette = [
  { label: 'Background', className: 'bg-background' },
  { label: 'Card', className: 'bg-card' },
  { label: 'Muted', className: 'bg-muted' },
  { label: 'Muted F.G', className: 'bg-muted-foreground' },
  { label: 'Border', className: 'bg-border' },
  { label: 'Foreground', className: 'bg-foreground' },
  { label: 'Primary', className: 'bg-primary' },
  { label: 'Primary Soft', className: 'bg-primary/30' },
  { label: 'Accent', className: 'bg-accent' },
  { label: 'Accent F.G', className: 'bg-accent-foreground' },
]

export const Design = () => (
  <div className='flex flex-col divide-y divide-dashed divide-border text-left'>
    <div className='space-y-4 bg-card/50 p-6 text-muted-foreground text-sm'>
      <p>
        A measured layout with generous spacing, sharp rules, and a quiet sense
        of depth. Geist Sans handles headings and body copy while Geist Mono
        keeps code and labels crisp.
      </p>
    </div>
    <div className='bg-card/50 p-6'>
      <div className='pb-3 font-medium text-foreground text-sm'>Palette</div>
      <div className='grid gap-3'>
        <div className='flex overflow-auto rounded-md border border-border'>
          {palette.map((tone) => (
            <div
              className={cn(
                'relative flex flex-1 items-center justify-center px-3 py-3 lg:min-w-20 xl:min-w-30',
                tone.className
              )}
              key={tone.label}
            >
              <span className='hidden h-6 items-center justify-center truncate rounded-sm border bg-white/80 px-2 font-medium text-[11px] text-black lg:inline-flex dark:bg-black/80 dark:text-white'>
                {tone.label}
              </span>
            </div>
          ))}
        </div>
        <p className='text-muted-foreground text-sm'>
          The palette stays neutral with a primary blue accent for focus and
          links.
        </p>
      </div>
    </div>
  </div>
)
