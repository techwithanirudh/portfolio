import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { ThemedImage } from '@/types'

interface LogoProps {
  alt: string
  className?: string
  logo?: ThemedImage
  size?: number
}

export function Logo({ alt, logo, size = 44, className }: LogoProps) {
  const wrapper = cn('flex items-center justify-center bg-muted', className)

  if (!logo) {
    // TODO(slopradar): duplicate-logic: second copy of the initials helper (see testimonials.tsx)
    const initials = alt
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
    return (
      <div
        aria-hidden='true'
        className={cn(
          wrapper,
          'p-1 font-semibold text-[11px] text-muted-foreground'
        )}
        style={{ height: size, width: size }}
      >
        {initials}
      </div>
    )
  }

  if (typeof logo === 'string') {
    return (
      <div
        className={cn(wrapper, 'relative overflow-hidden')}
        style={{ height: size, width: size }}
      >
        <Image
          alt=''
          className='rounded-lg object-contain'
          fill
          sizes={`${size}px`}
          src={logo}
        />
      </div>
    )
  }

  return (
    <div
      className={cn(wrapper, 'relative overflow-hidden')}
      style={{ height: size, width: size }}
    >
      <Image
        alt=''
        className='rounded object-contain dark:hidden'
        fill
        sizes={`${size}px`}
        src={logo.light}
      />
      <Image
        alt=''
        className='hidden rounded object-contain dark:block'
        fill
        sizes={`${size}px`}
        src={logo.dark}
      />
    </div>
  )
}
