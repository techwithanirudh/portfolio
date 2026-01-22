import { BadgeCheckIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SoftwareItem } from '@/types'
import { Logo } from './logo'

interface SoftwareCardProps extends SoftwareItem {
  index: number
}

function SoftwareCard({
  name,
  description,
  url,
  logo,
  featured,
  index,
}: SoftwareCardProps) {
  return (
    <div
      className={cn(
        index > 0 && 'border-border border-t border-dashed',
        index < 2 && 'sm:border-t-0',
        index % 2 === 0 && 'sm:border-border sm:border-r sm:border-dashed'
      )}
    >
      <a
        className='group/app flex items-start gap-4 p-6 transition-colors hover:bg-secondary/50 sm:p-8'
        href={url}
        rel='noopener noreferrer'
        target='_blank'
      >
        <Logo
          alt={name}
          className='rounded-md ring-1 ring-foreground/5 transition-transform group-hover/app:-rotate-12 group-hover/app:scale-115'
          logo={logo}
          size={40}
        />
        <div className='flex-1'>
          <div className='flex items-center gap-1.5'>
            <h3 className='font-semibold tracking-tight'>{name}</h3>
            {featured && <BadgeCheckIcon className='text-primary' size={16} />}
          </div>
          <p className='text-muted-foreground text-sm'>{description}</p>
        </div>
      </a>
    </div>
  )
}

interface SoftwareGridProps {
  items: SoftwareItem[]
}

export function SoftwareGrid({ items }: SoftwareGridProps) {
  const sortedItems = [...items].sort(
    (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
  )

  return (
    <div className='grid sm:grid-cols-2'>
      {sortedItems.map((item, index) => (
        <SoftwareCard index={index} key={item.name} {...item} />
      ))}
      {sortedItems.length % 2 === 1 && (
        <div className='hidden size-full min-h-[104px] border-border border-dashed bg-dashed sm:block sm:border-t-0' />
      )}
    </div>
  )
}
