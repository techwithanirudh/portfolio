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

  if (logo.type === 'custom') {
    if (typeof logo.url === 'string') {
      return (
        <div className={wrapper} style={{ height: size, width: size }}>
          <Image
            alt={alt}
            className='rounded'
            height={size}
            src={logo.url}
            width={size}
          />
        </div>
      )
    }

    return (
      <div className={wrapper} style={{ height: size, width: size }}>
        <Image
          alt={alt}
          className='rounded dark:hidden'
          height={size}
          src={logo.url.light}
          width={size}
        />
        <Image
          alt={alt}
          className='hidden rounded dark:block'
          height={size}
          src={logo.url.dark}
          width={size}
        />
      </div>
    )
  }
}
