import { resolveLinkItems } from 'fumadocs-ui/layouts/shared'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { ActiveLink } from '@/components/shared/active-link'
import { ViewAnimation } from '@/components/shared/view-animation'
import { linkItems, socials } from '@/constants/navigation'
import { baseOptions } from '@/constants/site'
import { getSortedWork } from '@/lib/source'

interface ListItem {
  external?: boolean
  href?: string
  items: {
    href: string
    children: ReactNode
    external?: boolean
  }[]
  title: string
}

export const Links = () => {
  const links = resolveLinkItems({
    githubUrl: baseOptions.githubUrl,
    links: linkItems,
  })
  const navItems = links.filter((item) =>
    ['nav', 'all'].includes(item.on ?? 'all')
  )

  const works = getSortedWork()

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
        { children: 'Uses', href: '/uses' },
        { children: 'Colophon', href: '/colophon' },
        {
          children: 'V1 Portfolio',
          external: true,
          href: 'https://v1.techwithanirudh.com/',
        },
        { children: 'RSS Feed', href: '/rss.xml' },
        { children: 'Sitemap', href: '/sitemap.xml' },
      ],
      title: 'More',
    },
    {
      items: works.slice(0, 5).map((work) => ({
        children: work.data.title,
        href: work.url,
      })),
      title: 'Work',
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
    <div className='grid grid-cols-2 gap-6 text-muted-foreground text-sm sm:grid-cols-4 sm:gap-8'>
      {lists.map((list, index) => (
        <ViewAnimation
          className='flex flex-col gap-3 sm:gap-6'
          delay={0.05 * index}
          initial={{ opacity: 0, translateY: -6 }}
          key={list.title}
          whileInView={{ opacity: 1, translateY: 0 }}
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
                <ActiveLink
                  href={item.href}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  target={item.external ? '_blank' : undefined}
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
