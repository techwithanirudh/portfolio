import type { ComponentProps } from 'react'
import { PreviewLink } from '@/components/preview-link'
import { getLinkPreviewImage } from '@/lib/link-preview'

export function LinkPreviewAnchor({ href, ...props }: ComponentProps<'a'>) {
  if (!href) {
    return <a {...props} />
  }

  return (
    <PreviewLink href={href} preview={getLinkPreviewImage(href)} {...props} />
  )
}
