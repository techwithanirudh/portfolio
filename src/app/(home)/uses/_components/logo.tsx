import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { Logo } from '@/types/uses'

interface LogoProps {
  alt: string
  logo?: Logo
  size?: number
  className?: string
}

export function Logo({ alt, logo, size = 44, className }: LogoProps) {
  const imgSize = size - 14
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
    return (
      <div className={wrapper} style={{ height: size, width: size }}>
        <Image
          alt={alt}
          className='rounded'
          height={imgSize}
          src={logo.url}
          width={imgSize}
        />
      </div>
    )
  }

  const src = (id: string) => `https://svgl.app/library/${id}.svg`

  if (typeof logo.id === 'string') {
    return (
      <div className={wrapper} style={{ height: size, width: size }}>
        <Image
          alt={alt}
          className='rounded'
          height={imgSize}
          src={src(logo.id)}
          width={imgSize}
        />
      </div>
    )
  }

  return (
    <div className={wrapper} style={{ height: size, width: size }}>
      <Image
        alt={alt}
        className='rounded dark:hidden'
        height={imgSize}
        src={src(logo.id.dark)}
        width={imgSize}
      />
      <Image
        alt={alt}
        className='hidden rounded dark:block'
        height={imgSize}
        src={src(logo.id.light)}
        width={imgSize}
      />
    </div>
  )
}
