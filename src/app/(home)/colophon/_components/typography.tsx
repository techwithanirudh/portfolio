import {
  colophonSections,
  colophonTypography,
} from '@/constants/portfolio/colophon'
import { cn } from '@/lib/utils'
import { ColophonSection } from './colophon-section'

export const Typography = () => (
  <ColophonSection
    className='flex flex-col divide-y divide-dashed divide-border text-left'
    title={colophonSections.typography.title}
  >
    <div className='bg-card/50 p-6 text-muted-foreground text-sm'>
      <p>{colophonTypography.intro}</p>
    </div>
    <div className='bg-card/50 p-6'>
      <div className='grid grid-cols-1 divide-y divide-dashed divide-border border border-border/70 border-dashed text-center sm:grid-cols-2 sm:divide-x sm:divide-y-0'>
        {colophonTypography.samples.map((sample) => (
          <div
            className={cn(
              'flex items-center justify-center px-4 py-6 text-base text-foreground transition-colors hover:bg-card/80 sm:text-lg',
              sample.className
            )}
            key={sample.label}
          >
            {sample.label}
          </div>
        ))}
      </div>
    </div>
  </ColophonSection>
)
