import {
  colophonSections,
  colophonTypography,
} from '@/constants/portfolio/colophon'
import { cn } from '@/lib/utils'
import { ColophonSection } from './colophon-section'

export const TypographySection = () => (
  <ColophonSection
    className='grid grid-cols-1 gap-px bg-border text-left sm:grid-cols-2'
    title={colophonSections.typography.title}
  >
    <div className='bg-card p-6 text-muted-foreground text-sm sm:col-span-2'>
      <p>{colophonTypography.intro}</p>
    </div>
    <div className='bg-card p-6 sm:col-span-2'>
      <div className='grid grid-cols-1 divide-y divide-dashed divide-border border border-border/70 border-dashed text-center sm:grid-cols-2 sm:divide-x sm:divide-y-0'>
        {colophonTypography.samples.map((sample) => (
          <div
            className={cn(
              'flex items-center justify-center px-4 py-6 text-base text-foreground sm:text-lg',
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
