import { RuledGrid } from '@/components/layout/ruled-grid'
import { palette, principles } from '@/constants/portfolio/colophon'
import { cn } from '@/lib/utils'

export const Design = () => (
  <div>
    <ol className='grid border-line border-b sm:grid-cols-2 [&>*:not(:last-child)]:border-b sm:[&>*:nth-child(odd)]:border-r sm:[&>*:nth-last-child(-n+2)]:border-b-0 [&>*]:border-line'>
      {principles.map((principle, index) => (
        <li
          className='group flex gap-3 p-4 transition-colors hover:bg-card'
          key={principle.title}
        >
          <span
            aria-hidden
            className='grid size-6 shrink-0 select-none place-items-center border border-line bg-card font-mono text-[0.6875rem] text-muted-foreground transition-[rotate,color] duration-300 group-hover:rotate-12 group-hover:text-primary'
          >
            {(index + 1).toString().padStart(2, '0')}
          </span>
          <div className='flex flex-col gap-0.5'>
            <h3 className='font-heading font-medium text-foreground text-sm tracking-tight'>
              {principle.title}
            </h3>
            <p className='text-pretty text-muted-foreground text-sm'>
              {principle.description}
            </p>
          </div>
        </li>
      ))}
    </ol>
    <div className='border-line border-b px-4 py-3 font-mono text-muted-foreground text-xs'>
      Palette
    </div>
    <RuledGrid className='grid-cols-3 sm:grid-cols-5'>
      {palette.map((tone) => (
        <div className='group flex flex-col bg-background' key={tone.token}>
          <div className='overflow-hidden border-line border-b'>
            <div
              className={cn(
                'h-16 transition-[scale] duration-300 group-hover:scale-110',
                tone.className
              )}
            />
          </div>
          <div className='flex flex-col gap-0.5 px-3 py-2'>
            <span className='font-medium text-foreground text-xs'>
              {tone.label}
            </span>
            <span className='truncate font-mono text-[0.6875rem] text-muted-foreground'>
              {tone.token}
            </span>
          </div>
        </div>
      ))}
    </RuledGrid>
  </div>
)
