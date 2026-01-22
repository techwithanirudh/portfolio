'use client'

import Image from 'next/image'
import { useTheme } from 'next-themes'
import type { UseLogo } from '@/constants/uses'
import { cn } from '@/lib/utils'

interface LogoProps {
  alt: string
  logo?: UseLogo
  size?: number
  className?: string
}

const buildLogoUrl = (logoId: string) =>
  `https://svgl.app/library/${logoId}.svg`

const getRouteForTheme = (
  logoId: string | { light: string; dark: string },
  theme: string
) => {
  if (typeof logoId === 'string') {
    return buildLogoUrl(logoId)
  }

  if (theme === 'dark') {
    return buildLogoUrl(logoId.light ?? logoId.dark)
  }

  return buildLogoUrl(logoId.dark ?? logoId.light)
}

const getFallbackLabel = (alt: string) =>
  alt
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

export const Logo = ({ alt, logo, size = 44, className }: LogoProps) => {
  const { resolvedTheme } = useTheme()
  const theme = resolvedTheme ?? 'light'
  let src: string | null = null

  if (logo?.type === 'custom') {
    src = logo.url
  } else if (logo?.type === 'svgl') {
    src = getRouteForTheme(logo.id, theme)
  }

  if (!src) {
    return (
      <div
        aria-label={alt}
        className={cn(
          'flex items-center justify-center bg-muted p-1 font-semibold text-[11px] text-muted-foreground',
          className
        )}
        role='img'
        style={{ height: size, width: size }}
      >
        {getFallbackLabel(alt)}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center bg-muted',
        className
      )}
      style={{ height: size, width: size }}
    >
      <Image alt={alt} height={size - 14} src={src} width={size - 14} className='rounded' />
    </div>
  )
}
