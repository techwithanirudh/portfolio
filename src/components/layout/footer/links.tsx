import { resolveLinkItems } from 'fumadocs-ui/layouts/shared'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { ActiveLink } from '@/components/layout/footer/active-link'
import { PreviewLink } from '@/components/preview-link'
import { ViewAnimation } from '@/components/view-animation'
import { linkItems, socials } from '@/constants/navigation'
import { baseOptions } from '@/constants/site'
import { cn } from '@/lib/utils'

interface LinkEntry {
  children: ReactNode
  /** Route handlers, not pages, so they need a full document load */
  document?: boolean
  external?: boolean
  href: string
}

interface ListItem {
  external?: boolean
  href?: string
  items: LinkEntry[]
  title: string
}

const plainLinkClassName =
  'text-muted-foreground text-sm transition-colors hover:text-foreground'

const FooterLink = ({ item }: { item: LinkEntry }) => {
  if (item.external) {
    return (
      <PreviewLink className={plainLinkClassName} href={item.href}>
        {item.children}
      </PreviewLink>
    )
  }

  if (item.document) {
    return (
      <a className={plainLinkClassName} href={item.href}>
        {item.children}
      </a>
    )
  }

  return <ActiveLink href={item.href}>{item.children}</ActiveLink>
}

export const Links = () => {
  const links = resolveLinkItems({
    githubUrl: baseOptions.githubUrl,
    links: linkItems,
  })
  const navItems = links.filter((item) =>
    ['nav', 'all'].includes(item.on ?? 'all')
  )

  const lists: ListItem[] = [
    {
      items: [
        { children: 'Home', href: '/' },
        ...navItems
          .filter(
            (item) =>
              item.type !== 'menu' &&
              item.type !== 'custom' &&
              item.type !== 'icon'
          )
          .map((item) => ({
            children: item.text,
            href: item.url,
          })),
      ],
      title: 'Navigate',
    },
    {
      items: [
        { children: 'Guestbook', href: '/guestbook' },
        { children: 'Uses', href: '/uses' },
        { children: 'Colophon', href: '/colophon' },
        { children: 'Resume', href: '/resume' },
        {
          children: 'V1 Portfolio',
          external: true,
          href: 'https://v1.techwithanirudh.com/',
        },
        { children: 'RSS Feed', document: true, href: '/rss.xml' },
        { children: 'Sitemap', document: true, href: '/sitemap.xml' },
      ],
      title: 'More',
    },
    {
      items: socials.map((social) => ({
        children: (
          <span className='inline-flex items-center gap-1.5 [&_svg]:size-4'>
            {social.icon}
            {social.name}
          </span>
        ),
        external: true,
        href: social.url,
      })),
      title: 'Socials',
    },
  ]

  return (
    <div className='grid grid-cols-2 gap-6 text-muted-foreground text-sm sm:grid-cols-3 sm:gap-8'>
      {lists.map((list, index) => (
        <ViewAnimation
          className={cn(
            'flex flex-col gap-3 sm:gap-6',
            index === lists.length - 1 && 'max-sm:col-span-2'
          )}
          delay={0.05 * index}
          key={list.title}
        >
          <div className='border-b pb-1 font-medium text-foreground sm:border-none sm:pb-0'>
            {list.href ? (
              <Link href={list.href}>{list.title}</Link>
            ) : (
              <p>{list.title}</p>
            )}
          </div>
          <ul className='flex flex-col gap-2 sm:gap-3'>
            {list.items.map((item) => (
              <li key={item.href}>
                <FooterLink item={item} />
              </li>
            ))}
          </ul>
        </ViewAnimation>
      ))}
    </div>
  )
}
