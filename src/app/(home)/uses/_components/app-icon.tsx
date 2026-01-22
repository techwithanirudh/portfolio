import { BadgeCheckIcon } from 'lucide-react'
import type { UseItem } from '@/types'
import { Logo } from './logo'

type AppIconProps = UseItem

export function AppIcon({ name, url, logo, featured }: AppIconProps) {
  return (
    <a
      className='group inline-block text-center no-underline transition-all duration-500'
      href={url}
      rel='noopener noreferrer'
      target='_blank'
    >
      <div className='relative h-28 w-28 rounded-[20px] border border-border bg-background p-2 transition-all duration-300 group-hover:-translate-y-3 group-hover:border-primary/40'>
        <div
          className='grid h-full place-items-center rounded-xl border-2 border-foreground/5 bg-muted'
          style={{
            boxShadow: '0px 2px 1.5px 0px rgba(165,174,184,0.32) inset',
          }}
        >
          <Logo alt={name} className='bg-transparent' logo={logo} size={40} />
        </div>
        {featured && (
          <div className='absolute -top-1 -right-1 rounded-full bg-primary p-1'>
            <BadgeCheckIcon className='h-3.5 w-3.5 text-primary-foreground' />
          </div>
        )}
      </div>
      <p className='mt-3 text-muted-foreground text-sm'>{name}</p>
    </a>
  )
}
