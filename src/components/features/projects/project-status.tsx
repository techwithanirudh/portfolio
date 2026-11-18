import type { ReactNode } from 'react'
import { Icons } from '@/components/icons/icons'
import { PreviewLink } from '@/components/preview-link'
import { getLinkPreviewImage } from '@/lib/link-preview'
import { hostname, repository } from '@/lib/project-links'
import type { ProjectPage } from '@/lib/source'
import { cn } from '@/lib/utils'

function StripLink({ href, label }: { href: string; label: string }) {
  return (
    <PreviewLink
      className='group/strip-link link-underline inline-flex max-w-full items-center gap-1'
      href={href}
      preview={getLinkPreviewImage(href)}
    >
      <span className='truncate'>{label}</span>
      <Icons.arrowUpRight className='size-3.5 shrink-0 text-muted-foreground transition-transform group-hover/strip-link:scale-125' />
    </PreviewLink>
  )
}

export function ProjectStatus({ page }: { page: ProjectPage }) {
  const { github, platform, status, website } = page.data
  // Links take a whole row on phones so a long host name doesn't truncate
  const items: { label: string; value: ReactNode; wide?: boolean }[] = []

  if (status) {
    items.push({ label: 'Status', value: status })
  }
  if (platform) {
    items.push({ label: 'Platform', value: platform })
  }
  if (website) {
    items.push({
      label: 'Website',
      value: <StripLink href={website} label={hostname(website)} />,
      wide: true,
    })
  }
  if (github) {
    items.push({
      label: 'Source',
      value: <StripLink href={github} label={repository(github)} />,
      wide: true,
    })
  }

  return (
    <dl className='grid grid-cols-2 gap-x-6 gap-y-4 border-t border-dashed pt-4 sm:flex sm:flex-wrap sm:gap-x-10'>
      {items.map((item) => (
        <div
          className={cn(
            'flex min-w-0 flex-col gap-1',
            item.wide && 'col-span-2'
          )}
          key={item.label}
        >
          <dt className='text-muted-foreground text-sm'>{item.label}</dt>
          <dd className='min-w-0 text-pretty text-sm'>{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
