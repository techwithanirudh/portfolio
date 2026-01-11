import { resolveLinkItems } from 'fumadocs-ui/layouts/shared'
import Link from 'next/link'
import type { ReactNode } from 'react'
import {
  baseOptions,
  linkItems,
  postsPerPage,
  socials,
} from '@/app/layout.shared'
import { ActiveLink } from '@/components/active-link'
import { ViewAnimation } from '@/components/view-animation'
import { getSortedByDatePosts, getTags } from '@/lib/source'

interface ListItem {
  title: string
  href?: string
  external?: boolean
  items: {
    href: string
    children: ReactNode
  }[]
}

export const Links = async () => {
  const links = resolveLinkItems({
    links: linkItems,
    githubUrl: baseOptions.githubUrl,
  })
  const navItems = links.filter((item) =>
    ['nav', 'all'].includes(item.on ?? 'all')
  )

  const posts = getSortedByDatePosts()
  const tags = getTags()

  const lists: ListItem[] = [
    {
      title: 'Pages',
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
      title: 'Posts',
      items: posts.slice(0, postsPerPage).map((post) => ({
        href: post.url,
        children: post.data.title,
      })),
    },
    {
      title: 'Tags',
      items: tags.slice(0, postsPerPage).map((name) => ({
        href: `/tags/${name}`,
        children: <span className='capitalize'>{name}</span>,
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
    <div className='grid gap-8 text-muted-foreground text-sm sm:grid-cols-4'>
      {lists.map((list, index) => (
        <ViewAnimation
          className='flex flex-col gap-6'
          delay={index * 0.1}
          initial={{ opacity: 0, translateY: -8 }}
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
          <ul className='flex flex-col gap-3'>
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
