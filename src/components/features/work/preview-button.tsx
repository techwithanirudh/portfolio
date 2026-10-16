import type { ReactNode } from 'react'
import { PreviewLink } from '@/components/preview-link'
import { buttonVariants } from '@/components/ui/button'
import { getLinkPreview } from '@/lib/link-preview'
import { cn } from '@/lib/utils'

interface PreviewButtonProps {
  className?: string
  href: string
  icon?: ReactNode
  label: string
}

export function PreviewButton({
  className,
  href,
  icon,
  label,
}: PreviewButtonProps) {
  return (
    <PreviewLink
      className={buttonVariants({
        className: cn('[&_svg]:text-muted-foreground', className),
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
