import type { ReactNode } from 'react'
import { PreviewLink } from '@/components/preview-link'
import { buttonVariants } from '@/components/ui/button-variants'
import { getLinkPreviewImage } from '@/lib/link-preview'
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
      className={cn(
        buttonVariants({ size: 'sm', variant: 'secondary' }),
        className
      )}
      href={href}
      preview={getLinkPreviewImage(href)}
    >
      {icon}
      <span className='truncate'>{label}</span>
    </PreviewLink>
  )
}
