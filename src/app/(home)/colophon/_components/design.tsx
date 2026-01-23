import {
  colophonDesign,
  colophonSections,
} from '@/constants/portfolio/colophon'
import { cn } from '@/lib/utils'
import { ColophonSection } from './colophon-section'

export const DesignSection = () => (
  <ColophonSection
    className='grid grid-cols-1 gap-px bg-border text-left sm:grid-cols-2'
    title={colophonSections.design.title}
  >
    <div className='space-y-4 bg-card p-6 text-muted-foreground text-sm sm:col-span-2'>
      {colophonDesign.intro.map((line) => (
        <p key={line}>
          {line}
        </p>
      ))}
    </div>
    <div className='bg-card p-6 sm:col-span-2'>
      <div className='pb-3 font-medium text-foreground text-sm'>Palette</div>
      <div className='grid gap-3'>
        <div className='flex overflow-hidden rounded-md border border-border/70'>
          {colophonDesign.palette.map((tone) => (
            <div
              className={cn(
                'relative flex min-w-[3rem] flex-1 items-center justify-center px-3 py-3',
                tone.className
              )}
              key={tone.label}
            >
              <span className='inline-flex h-6 items-center justify-center rounded-sm border bg-white/80 px-2 font-medium text-[11px] text-black dark:bg-black/80 dark:text-white'>
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
