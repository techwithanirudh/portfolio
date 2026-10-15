import type { ReactNode } from 'react'
import { PreviewLink } from '@/components/preview-link'
import { buttonVariants } from '@/components/ui/button'
import { getLinkPreview } from '@/lib/link-preview'

interface PreviewButtonProps {
  href: string
  icon?: ReactNode
  label: string
}

export function PreviewButton({ href, icon, label }: PreviewButtonProps) {
  return (
    <PreviewLink
      className={buttonVariants({
        className: '[&_svg]:text-muted-foreground',
        size: 'sm',
        variant: 'toolbar',
      })}
      href={href}
      preview={getLinkPreview(href)}
    >
      {icon}
      {label}
    </PreviewLink>
  )
}
