import { resolveLinkItems } from 'fumadocs-ui/layouts/shared'
import type { ReactNode } from 'react'
import { ActiveLink } from '@/components/layout/footer/active-link'
import { splitLinkItems } from '@/components/layout/split-link-items'
import { PreviewLink } from '@/components/preview-link'
import { staggerDelay, ViewAnimation } from '@/components/view-animation'
import { linkItems, socials } from '@/constants/navigation'
import { baseOptions } from '@/constants/site'
import { cn } from '@/lib/utils'

interface LinkEntry {
  children: ReactNode
  external?: boolean
  href: string
  routeHandler?: boolean
}

interface LinkGroup {
  items: LinkEntry[]
  title: string
}

const plainLinkClassName =
  'text-muted-foreground text-sm transition-colors hover:text-foreground'

const FooterLink = ({ item }: { item: LinkEntry }) => {
  if (item.external) {
    return (
      <PreviewLink
        className={plainLinkClassName}
        href={item.href}
        preview={null}
      >
        {item.children}
      </PreviewLink>
    )
  }

  if (item.routeHandler) {
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
  const { navItems } = splitLinkItems(links)

  const lists: LinkGroup[] = [
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
      // TODO(slopradar): data-in-component: the More links (Uses, Colophon, Resume, V1, RSS) are hard-coded here while nav and socials come from constants/navigation, move them there
      items: [
        { children: 'Uses', href: '/uses' },
        { children: 'Colophon', href: '/colophon' },
        { children: 'Resume', href: '/resume' },
        {
          children: 'V1 portfolio',
          external: true,
          href: 'https://v1.techwithanirudh.com/',
        },
        { children: 'RSS feed', href: '/rss.xml', routeHandler: true },
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
          delay={staggerDelay(index)}
          key={list.title}
        >
          {/* TODO(slopradar): a11y: each link group is titled by a <p> inside a <div>, use a heading (h2 or h3) or aria-labelledby on the list so the footer groups are navigable */}
          <div className='border-b pb-1 font-medium text-foreground sm:border-none sm:pb-0'>
            <p>{list.title}</p>
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
