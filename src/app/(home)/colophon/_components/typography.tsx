import { PreviewLink } from '@/components/preview-link'
import { fonts, typography } from '@/constants/portfolio/colophon'
import { cn } from '@/lib/utils'

const sample =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789'

export const Typography = () => (
  <div>
    <div className='grid border-line border-b sm:grid-cols-2 sm:divide-x sm:divide-line max-sm:[&>*:first-child]:border-line max-sm:[&>*:first-child]:border-b'>
      {fonts.map((font) => (
        <PreviewLink
          className={cn(
            'group flex flex-col gap-4 p-4 transition-colors hover:bg-card',
            font.className
          )}
          data-sound-hover
          href={font.url}
          key={font.name}
        >
          <span className='flex items-center justify-between font-mono text-muted-foreground text-xs'>
            <span>{font.name}</span>
            <span className='border border-line px-1.5 py-0.5'>
              {font.role}
            </span>
          </span>
          <span
            aria-hidden
            className='origin-left select-none text-7xl text-foreground tracking-tight transition-[rotate,scale] duration-300 group-hover:-rotate-3 group-hover:scale-105'
          >
            Aa
          </span>
          <span className='break-all text-muted-foreground text-sm'>
            {sample}
          </span>
        </PreviewLink>
      ))}
    </div>
    <div className='grid grid-cols-2 sm:grid-cols-4 sm:[&>*:not(:last-child)]:border-r max-sm:[&>*:nth-child(-n+2)]:border-b max-sm:[&>*:nth-child(odd)]:border-r [&>*]:border-line'>
      {typography.map((item) => (
        <div
          className='group flex flex-col gap-2 p-4 transition-colors hover:bg-card'
          key={item.label}
        >
          <span
            aria-hidden
            className={cn(
              'origin-left select-none text-4xl text-foreground tracking-tight transition-[rotate,scale] duration-300 group-hover:-rotate-6 group-hover:scale-110',
              item.className
            )}
          >
            Ag
          </span>
          <span className='font-mono text-muted-foreground text-xs'>
            {item.label}{' '}
            <span className='text-muted-foreground/50'>{item.weight}</span>
          </span>
        </div>
      ))}
    </div>
  </div>
)
