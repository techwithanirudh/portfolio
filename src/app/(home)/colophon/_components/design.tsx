import {
  colophonDesign,
  colophonSections,
} from '@/constants/portfolio/colophon'
import { cn } from '@/lib/utils'
import { ColophonSection } from './colophon-section'

export const Design = () => (
  <ColophonSection
    className='flex flex-col divide-y divide-dashed divide-border text-left'
    title={colophonSections.design.title}
  >
    <div className='space-y-4 bg-card/50 p-6 text-muted-foreground text-sm'>
      {colophonDesign.intro.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
    <div className='bg-card/50 p-6'>
      <div className='pb-3 font-medium text-foreground text-sm'>Palette</div>
      <div className='grid gap-3'>
        <div className='flex overflow-auto rounded-md border border-border'>
          {colophonDesign.palette.map((tone) => (
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
  </ColophonSection>
)
