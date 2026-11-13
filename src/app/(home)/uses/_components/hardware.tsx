import Image from 'next/image'
import { externalLinkProps } from '@/components/external-link'
import { cn } from '@/lib/utils'
import type { HardwareItem } from '@/types'

function HardwareCard({ name, description, url, image }: HardwareItem) {
  const className = cn(
    'group/item flex items-center gap-3 bg-card/50 p-4 transition-colors sm:gap-4 sm:p-6',
    url && 'hover:bg-card/80'
  )
  const content = (
    <>
      {image ? (
        <div className='flex size-16 shrink-0 items-center justify-center'>
          <Image
            alt={name}
            className={cn(
              'h-auto max-h-14 w-auto object-contain drop-shadow-md transition-transform',
              url && 'group-hover/item:scale-105'
            )}
            height={56}
            src={image}
            width={56}
          />
        </div>
      ) : (
        <div className='flex size-16 shrink-0 items-center justify-center rounded-lg bg-muted'>
          <span className='font-semibold text-muted-foreground text-xs'>
            {name.slice(0, 2).toUpperCase()}
          </span>
        </div>
      )}
      <div className='min-w-0 flex-1'>
        <p className='font-medium text-foreground'>{name}</p>
        {description && (
          <p className='text-muted-foreground text-sm'>{description}</p>
        )}
      </div>
    </>
  )

  return url ? (
    <a className={className} href={url} {...externalLinkProps}>
      {content}
    </a>
  ) : (
    <div className={className}>{content}</div>
  )
}

interface HardwareGridProps {
  items: HardwareItem[]
}

export function HardwareGrid({ items }: HardwareGridProps) {
  return (
    <div className='dashed-grid sm:dashed-grid-2 grid sm:grid-cols-2'>
      {items.map((item) => (
        <HardwareCard key={item.name} {...item} />
      ))}
    </div>
  )
}
