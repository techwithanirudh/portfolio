import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { Logo as LogoType } from '@/types'

interface LogoProps {
  alt: string
  logo?: LogoType
  size?: number
  className?: string
}

export function Logo({ alt, logo, size = 44, className }: LogoProps) {
  const wrapper = cn('flex items-center justify-center bg-muted', className)

  if (!logo) {
    const initials = alt
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
    return (
      <div
        aria-label={alt}
        className={cn(
          wrapper,
          'p-1 font-semibold text-[11px] text-muted-foreground'
        )}
        role='img'
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
          alt={alt}
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
        alt={alt}
        className='rounded object-contain dark:hidden'
        fill
        sizes={`${size}px`}
        src={logo.light}
      />
      <Image
        alt={alt}
        className='hidden rounded object-contain dark:block'
        fill
        sizes={`${size}px`}
        src={logo.dark}
      />
    </div>
  )
}
