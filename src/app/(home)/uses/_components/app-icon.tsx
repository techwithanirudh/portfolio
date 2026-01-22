import { BadgeCheckIcon } from 'lucide-react'
import type { UseItem } from '@/types'
import { Logo } from './logo'

type AppIconProps = UseItem

export function AppIcon({ name, url, logo, featured }: AppIconProps) {
  return (
    <a
      className='group flex flex-col items-center gap-3 p-6 text-center no-underline transition-colors hover:bg-card/50'
      href={url}
      rel='noopener noreferrer'
      target='_blank'
    >
      <div className='relative group-hover:-translate-y-1 group-hover:scale-105 transition-transform duration-300'>
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
