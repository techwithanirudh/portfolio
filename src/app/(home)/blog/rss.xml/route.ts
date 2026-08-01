import { Feed } from 'feed'
import { baseUrl } from '@/constants'
import { description, owner, title } from '@/constants/site'
import { getPosts } from '@/lib/source'

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

  return new Response(feed.atom1(), {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}

function createFeed(): Feed {
  const feed = new Feed({
    copyright: `All rights reserved ${new Date().getFullYear()}, ${owner}`,
    description,
    favicon: new URL('/favicon.ico', baseUrl).href,
    feed: new URL('/blog/rss.xml', baseUrl).href,
    id: baseUrl.href,
    image: new URL('/banner.png', baseUrl).href,
    language: 'en',
    link: baseUrl.href,
    title,
    updated: new Date(),
  })

  const posts = getPosts()
  for (const post of posts) {
    feed.addItem({
      author: [
        {
          name: post.data.author,
          // link: new URL('/about', baseUrl).href,
        },
      ],
      date: post.data.date,
      description: post.data.description,
      image: {
        title: post.data.title,
        type: 'image/webp',
        url: escapeForXML(
          new URL(`/og/${post.slugs.join('/')}/image.webp`, baseUrl.href).href
        ),
      },
      link: new URL(post.url, baseUrl).href,
      title: post.data.title,
    })
  }

  return feed
}
