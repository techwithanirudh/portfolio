import {
  colophonDesign,
  colophonSections,
} from '@/constants/portfolio/colophon'
import { cn } from '@/lib/utils'
import { ColophonSection } from './colophon-section'

export const DesignSection = () => (
  <ColophonSection
    className='grid grid-cols-1 gap-px bg-border text-left'
    title={colophonSections.design.title}
  >
    <div className='space-y-4 bg-card/50 p-6 text-muted-foreground text-sm sm:col-span-2'>
      {colophonDesign.intro.map((line) => (
        <p className='typography-body' key={line}>
          {line}
        </p>
      ))}
    </div>
    <div className='bg-card/50 p-6'>
      <div className='pb-3 font-medium text-foreground text-sm'>Typography</div>
      <div className='space-y-4 text-muted-foreground text-sm'>
        <div>
          <span className='text-muted-foreground/70 text-xs uppercase tracking-wide'>
            Sans
          </span>
          <p className='font-semibold text-foreground text-lg'>
            {colophonDesign.typography.heading}
          </p>
        </div>
        <div>
          <span className='text-muted-foreground/70 text-xs uppercase tracking-wide'>
            Mono
          </span>
          <p className='font-mono text-foreground text-sm'>
            {colophonDesign.typography.mono}
          </p>
        </div>
        <p>{colophonDesign.typography.bodySample}</p>
        <a
          className='block text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground'
          href='https://vercel.com/font'
          rel='noopener noreferrer'
          target='_blank'
        >
          {colophonDesign.typography.inlineLink}
        </a>
      </div>
    </div>
    <div className='bg-card/50 p-6 sm:col-span-2'>
      <div className='pb-3 font-medium text-foreground text-sm'>Palette</div>
      <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
        {colophonDesign.palette.map((tone) => (
          <div className='flex flex-col gap-2' key={tone.label}>
            <div
              className={cn(
                'h-9 w-9 rounded-sm border border-border/60 shadow-sm',
                tone.className
              )}
            />
            <span className='text-muted-foreground text-xs'>{tone.label}</span>
          </div>
        ))}
      </div>
    </div>
  </ColophonSection>
)
