import type { ReactNode } from 'react'
import { PreviewLink } from '@/components/preview-link'
import { buttonVariants } from '@/components/ui/button-variants'
import { getLinkPreviewImage } from '@/lib/link-preview'

interface PreviewButtonProps {
  href: string
  icon?: ReactNode
  label: string
}

export function PreviewButton({ href, icon, label }: PreviewButtonProps) {
  return (
    <PreviewLink
      className={buttonVariants({ size: 'sm', variant: 'secondary' })}
      href={href}
      preview={getLinkPreviewImage(href)}
    >
      {icon}
      {label}
    </PreviewLink>
  )
}
