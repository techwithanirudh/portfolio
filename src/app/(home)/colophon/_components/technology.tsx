import { Icons } from '@/components/icons/icons'
import { PreviewLink } from '@/components/preview-link'
import { technologyGroups } from '@/constants/portfolio/colophon'
import { cn } from '@/lib/utils'
import type { TechnologyItem } from '@/types/colophon'

const tileClassName =
  'group flex h-full flex-col gap-1 bg-background p-4 text-left transition-colors'

const TechnologyTile = ({ name, description, url }: TechnologyItem) => {
  const content = (
    <>
      <span className='flex items-center justify-between gap-2'>
        <span className='font-medium text-foreground text-sm'>{name}</span>
        {url ? (
          <Icons.arrowUpRight className='size-3.5 shrink-0 text-muted-foreground transition-[rotate,scale,color] duration-300 group-hover:rotate-45 group-hover:scale-110 group-hover:text-primary' />
        ) : (
          <Icons.pawPrint className='size-3.5 shrink-0 text-muted-foreground transition-[rotate,scale,color] duration-300 group-hover:-rotate-12 group-hover:scale-125 group-hover:text-primary' />
        )}
      </span>
      <span className='text-pretty text-muted-foreground text-xs'>
        {description}
      </span>
    </>
  )

  if (!url) {
    return <div className={cn(tileClassName, 'hover:bg-card')}>{content}</div>
  }

  return (
    <PreviewLink
      className={cn(tileClassName, 'hover:bg-card')}
      data-sound-hover
      href={url}
    >
      {content}
    </PreviewLink>
  )
}

export const Technology = () => (
  <div>
    {technologyGroups.map((group, index) => (
      <div
        className='grid border-line border-b last:border-b-0 sm:grid-cols-[9rem_1fr]'
        key={group.label}
      >
        <div className='border-line border-b px-4 py-3 font-mono text-muted-foreground text-xs sm:border-r sm:border-b-0'>
          <span
            aria-hidden
            className='mr-1.5 select-none text-muted-foreground/50'
          >
            {(index + 1).toString().padStart(2, '0')}
          </span>
          {group.label}
        </div>
        {/* Tiles draw their own right and bottom rules and the outer edges
            get clipped, so a short last row closes out in hatch */}
        <div className='overflow-hidden'>
          <div className='-mr-px -mb-px grid bg-dashed sm:grid-cols-2 [&>*]:border-line [&>*]:border-r [&>*]:border-b'>
            {group.items.map((item) => (
              <TechnologyTile key={item.name} {...item} />
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
)
