import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { HardwareItem } from '@/types'

function HardwareCard({ name, description, url, image }: HardwareItem) {
  const Wrapper = url ? 'a' : 'div'
  const linkProps = url
    ? { href: url, target: '_blank', rel: 'noopener noreferrer' }
    : {}

  return (
    <Wrapper
      className={cn(
        'group/item flex items-center gap-3 bg-card/50 p-4 transition-colors sm:gap-4 sm:p-6',
        url && 'hover:bg-card/80'
      )}
      {...linkProps}
    >
      {image ? (
        <div className='flex size-16 shrink-0 items-center justify-center'>
          <Image
            alt={name}
            className={cn(
              'max-h-14 w-auto object-contain drop-shadow-md transition-transform',
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
        <p className={cn('font-medium text-foreground')}>{name}</p>
        {description && (
          <p className='text-muted-foreground text-sm'>{description}</p>
        )}
      </div>
    </Wrapper>
  )
}

interface HardwareGridProps {
  items: HardwareItem[]
}

export function HardwareGrid({ items }: HardwareGridProps) {
  return (
    <div className='grid divide-x divide-dashed divide-border sm:grid-cols-2 [&>*:nth-last-child(-n+1)]:border-b-0 sm:[&>*:nth-last-child(-n+2)]:border-b-0 [&>*]:border-border [&>*]:border-b [&>*]:border-dashed'>
      {items.map((item) => (
        <HardwareCard key={item.name} {...item} />
      ))}
    </div>
  )
}
