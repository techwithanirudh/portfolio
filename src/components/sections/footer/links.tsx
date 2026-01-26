import { resolveLinkItems } from 'fumadocs-ui/layouts/shared'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { ActiveLink } from '@/components/active-link'
import { ViewAnimation } from '@/components/view-animation'
import { linkItems, socials } from '@/constants/navigation'
import { baseOptions } from '@/constants/site'
import { getSortedByDateWork } from '@/lib/source'

interface ListItem {
  title: string
  href?: string
  external?: boolean
  items: {
    href: string
    children: ReactNode
  }[]
}

export const Links = () => {
  const links = resolveLinkItems({
    links: linkItems,
    githubUrl: baseOptions.githubUrl,
  })
  const navItems = links.filter((item) =>
    ['nav', 'all'].includes(item.on ?? 'all')
  )

  const works = getSortedByDateWork()

  const lists: ListItem[] = [
    {
      title: 'Navigate',
      items: [
        { href: '/', children: 'Home' },
        ...navItems
          .filter(
            (item) =>
              item.type !== 'menu' &&
              item.type !== 'custom' &&
              item.type !== 'icon'
          )
          .map((item) => ({
            href: item.url,
            children: item.text,
          })),
      ],
    },
    {
      title: 'More',
      items: [
        { href: '/uses', children: 'Uses' },
        { href: '/colophon', children: 'Colophon' },
        { href: '/rss.xml', children: 'RSS Feed' },
        { href: '/sitemap.xml', children: 'Sitemap' },
      ],
    },
    {
      title: 'Work',
      items: works.slice(0, 5).map((work) => ({
        href: work.url,
        children: work.data.title,
      })),
    },
    {
      title: 'Socials',
      items: socials.map((social) => ({
        href: social.url,
        external: true,
        children: (
          <span className='inline-flex items-center gap-1.5 [&_svg]:size-4'>
            {social.icon}
            {social.name}
          </span>
        ),
      })),
    },
  ]

  return (
    <div className='grid grid-cols-2 gap-6 text-muted-foreground text-sm sm:grid-cols-4 sm:gap-8'>
      {lists.map((list, index) => (
        <ViewAnimation
          className='flex flex-col gap-3 sm:gap-6'
          delay={0.05 * index}
          duration={0.3}
          initial={{ opacity: 0, translateY: -6 }}
          key={list.title}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          <div className='font-medium text-foreground'>
            {list.href ? (
              <Link href={list.href}>{list.title}</Link>
            ) : (
              <p>{list.title}</p>
            )}
          </div>
          <ul className='flex flex-col gap-2 sm:gap-3'>
            {list.items.map((item) => (
              <li key={item.href}>
                <ActiveLink
                  href={item.href}
                  rel={list.external ? 'noopener noreferrer' : undefined}
                  target={list.external ? '_blank' : undefined}
                >
                  {item.children}
                </ActiveLink>
              </li>
            ))}
          </ul>
        </ViewAnimation>
      ))}
    </div>
  )
}
