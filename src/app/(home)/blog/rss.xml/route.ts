import { Feed } from 'feed'
import { description, owner, title } from '@/constants/site'
import { baseUrl, getBlogPageImage } from '@/lib/metadata'
import { getSortedByDatePosts } from '@/lib/source'
import { url } from '@/lib/url'

export const dynamic = 'force-static'

const feedUrl = url('/blog/rss.xml')

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
    favicon: url('/icon.png'),
    feed: feedUrl,
    feedLinks: { rss: feedUrl },
    id: baseUrl.href,
    image: url('/banner.png'),
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
        },
      ],
      category: post.data.tags?.map((name) => ({ name })),
      date: post.data.lastModified ?? post.data.date,
      description: post.data.description,
      image: {
        title: post.data.title,
        type: 'image/webp',
        url: url(getBlogPageImage(post).url),
      },
      link: url(post.url),
      published: post.data.date,
      title: post.data.title,
    })
  }

  return feed
}
