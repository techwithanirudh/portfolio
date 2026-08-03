import Link from 'next/link'
import type { ComponentProps } from 'react'
import { getLinkPreview } from '@/lib/link-preview'
import { cn } from '@/lib/utils'
import { LinkPreviewCard } from './link-preview.client'

type LinkProps = ComponentProps<'a'>

export function LinkPreview({
  children,
  className,
  href,
  ...props
}: LinkProps) {
  if (href?.startsWith('/')) {
    return (
      <Link className={className} href={href} {...props}>
        {children}
      </Link>
    )
  }

  if (!(href && (href.startsWith('http://') || href.startsWith('https://')))) {
    return (
      <a className={className} href={href} {...props}>
        {children}
      </a>
    )
  }

  const preview = getLinkPreview(href)

  if (!preview) {
    return (
      <a
        className={className}
        href={href}
        rel='noopener noreferrer'
        target='_blank'
        {...props}
      >
        {children}
      </a>
    )
  }

  return (
    <LinkPreviewCard className={className} href={href} preview={preview}>
      {children}
    </LinkPreviewCard>
  )
}

export function LinkPreviewAnchor({ className, ...props }: LinkProps) {
  return <LinkPreview className={cn(className)} {...props} />
}
