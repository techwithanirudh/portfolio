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
      // A flush cell in the header row, like the blog post's actions
      className={buttonVariants({
        className:
          'h-full rounded-none px-3 hover:bg-card/80 active:scale-none [&_svg]:text-muted-foreground',
        size: 'sm',
        variant: 'ghost',
      })}
      href={href}
      preview={getLinkPreview(href)}
    >
      {icon}
      {label}
    </PreviewLink>
  )
}
