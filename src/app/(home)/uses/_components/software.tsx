import { Icons } from '@/components/icons/icons'
import type { SoftwareItem } from '@/types'
import { Logo } from './logo'

function AppIcon({ name, url, logo, featured }: SoftwareItem) {
  return (
    <a
      className='group flex h-full flex-col items-center gap-2.5 bg-background px-2 py-5 text-center no-underline transition-colors hover:bg-card'
      href={url}
      rel='noopener noreferrer'
      target='_blank'
    >
      <div className='relative transition-[scale] duration-300 ease-out group-hover:scale-110'>
        <div className='grid size-14 place-items-center border border-line bg-card'>
          <Logo alt={name} className='bg-transparent' logo={logo} size={32} />
        </div>
        {featured && (
          <div className='absolute -top-1.5 -right-1.5 bg-primary p-0.5'>
            <Icons.featured className='size-3 text-primary-foreground' />
          </div>
        )}
      </div>
      <span className='w-full truncate font-mono text-muted-foreground text-xs transition-colors group-hover:text-foreground'>
        {name}
      </span>
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
    // Every tile draws its own right and bottom rule, the outer edges get
    // clipped so the rails and the next section line do the framing
    <div className='overflow-hidden'>
      <div className='-mr-px -mb-px grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 [&>*]:border-line [&>*]:border-r [&>*]:border-b'>
        {sortedItems.map((item) => (
          <AppIcon key={item.name} {...item} />
        ))}
      </div>
    </div>
  )
}
