import type { MetadataRoute } from 'next'
import { baseUrl } from '@/lib/metadata'
import { getPosts, getTags, getWorkPages } from '@/lib/source'

type Entry = MetadataRoute.Sitemap[number]
interface Page {
  data: { date: Date; lastModified?: Date }
  url: string
}

const url = (path: string) => new URL(path, baseUrl).href

const modified = (page: Page) => page.data.lastModified ?? page.data.date

const newest = (pages: Page[]) =>
  new Date(Math.max(...pages.map((page) => modified(page).getTime())))

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts()
  const work = getWorkPages()
  const lastContentUpdate = newest([...posts, ...work])

  const pages: Entry[] = [
    {
      changeFrequency: 'monthly',
      lastModified: lastContentUpdate,
      priority: 1,
      url: url('/'),
    },
    {
      changeFrequency: 'weekly',
      lastModified: newest(posts),
      priority: 0.8,
      url: url('/blog'),
    },
    {
      changeFrequency: 'monthly',
      lastModified: newest(work),
      priority: 0.8,
      url: url('/projects'),
    },
    { changeFrequency: 'monthly', priority: 0.6, url: url('/about') },
    { changeFrequency: 'monthly', priority: 0.5, url: url('/contact') },
    { changeFrequency: 'monthly', priority: 0.5, url: url('/resume') },
    { changeFrequency: 'yearly', priority: 0.4, url: url('/uses') },
    { changeFrequency: 'yearly', priority: 0.4, url: url('/colophon') },
    { changeFrequency: 'weekly', priority: 0.4, url: url('/guestbook') },
  ]

  const tags: Entry[] = getTags().map((tag) => ({
    changeFrequency: 'monthly',
    priority: 0.3,
    url: url(`/blog/tags/${tag}`),
  }))

  const postEntries: Entry[] = posts.map((post) => ({
    changeFrequency: 'monthly',
    lastModified: modified(post),
    priority: 0.7,
    url: url(post.url),
  }))

  const workEntries: Entry[] = work.map((page) => ({
    changeFrequency: 'monthly',
    lastModified: modified(page),
    priority: 0.7,
    url: url(page.url),
  }))

  return [...pages, ...postEntries, ...workEntries, ...tags]
}
