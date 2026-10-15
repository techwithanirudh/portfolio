import { Feed } from 'feed'
import { baseUrl } from '@/constants'
import { description, owner, title } from '@/constants/site'
import { getBlogPageImage } from '@/lib/metadata'
import { getSortedByDatePosts } from '@/lib/source'

export const dynamic = 'force-static'

const escapeForXML = (str: string): string =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

export const GET = () => {
  const feed = createFeed()

  return new Response(feed.rss2(), {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  })
}

function createFeed(): Feed {
  const posts = getSortedByDatePosts()
  const latest = posts[0]?.data
  const feed = new Feed({
    copyright: `All rights reserved ${new Date().getFullYear()}, ${owner}`,
    description,
    favicon: new URL('/icon.png', baseUrl).href,
    feed: new URL('/blog/rss.xml', baseUrl).href,
    feedLinks: { rss: new URL('/blog/rss.xml', baseUrl).href },
    id: baseUrl.href,
    image: new URL('/banner.png', baseUrl).href,
    language: 'en',
    link: baseUrl.href,
    title,
    updated: latest?.lastModified ?? latest?.date,
  })

  for (const post of posts) {
    feed.addItem({
      author: [
        {
          name: post.data.author,
          // link: new URL('/about', baseUrl).href,
        },
      ],
      category: post.data.tags?.map((name) => ({ name })),
      date: post.data.lastModified ?? post.data.date,
      description: post.data.description,
      image: {
        title: post.data.title,
        type: 'image/webp',
        url: escapeForXML(
          new URL(getBlogPageImage(post).url, baseUrl.href).href
        ),
      },
      link: new URL(post.url, baseUrl).href,
      published: post.data.date,
      title: post.data.title,
    })
  }

  return feed
}
