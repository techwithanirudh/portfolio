import { BadgeCheckIcon } from 'lucide-react'
import type { SoftwareItem } from '@/types'
import { Logo } from './logo'

function AppIcon({ name, url, logo, featured }: SoftwareItem) {
  return (
    <a
      className='group flex flex-col items-center gap-3 p-6 text-center no-underline transition-colors hover:bg-card/50'
      href={url}
      rel='noopener noreferrer'
      target='_blank'
    >
      <div className='relative transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105'>
        <div
          className='grid size-20 place-items-center rounded-xl border-2 border-foreground/5 bg-muted'
          style={{
            boxShadow: '0px 2px 1.5px 0px rgba(165,174,184,0.32) inset',
          }}
        >
          <Logo alt={name} className='bg-transparent' logo={logo} size={36} />
        </div>
        {featured && (
          <div className='absolute -top-1 -right-1 rounded-full bg-primary p-1'>
            <BadgeCheckIcon className='size-3 text-primary-foreground' />
          </div>
        )}
      </div>
      <span className='text-muted-foreground text-sm'>{name}</span>
    </a>
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
    <div className='grid grid-cols-3 gap-px bg-border sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8'>
      {sortedItems.map((item) => (
        <div className='bg-card' key={item.name}>
          <AppIcon {...item} />
        </div>
      ))}
    </div>
  )
}
