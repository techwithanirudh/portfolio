import type { MetadataRoute } from 'next'
import { pages } from '@/constants/pages'
import {
  type BlogPage,
  getPosts,
  getTags,
  getWorkPages,
  type WorkPage,
} from '@/lib/source'
import { url } from '@/lib/url'

type Entry = MetadataRoute.Sitemap[number]
type Page = BlogPage | WorkPage

const modified = (page: Page) => page.data.lastModified ?? page.data.date

const newest = (pages: Page[]) =>
  new Date(Math.max(...pages.map((page) => modified(page).getTime())))

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts()
  const work = getWorkPages()
  const lastContentUpdate = newest([...posts, ...work])

  const staticEntries: Entry[] = [
    {
      changeFrequency: 'monthly',
      lastModified: lastContentUpdate,
      priority: 1,
      url: url(pages.home.path),
    },
    {
      changeFrequency: 'weekly',
      lastModified: newest(posts),
      priority: 0.8,
      url: url(pages.blog.path),
    },
    {
      changeFrequency: 'monthly',
      lastModified: newest(work),
      priority: 0.8,
      url: url(pages.projects.path),
    },
    { changeFrequency: 'monthly', priority: 0.6, url: url(pages.about.path) },
    { changeFrequency: 'monthly', priority: 0.5, url: url(pages.contact.path) },
    { changeFrequency: 'monthly', priority: 0.5, url: url(pages.resume.path) },
    { changeFrequency: 'yearly', priority: 0.4, url: url(pages.uses.path) },
    { changeFrequency: 'yearly', priority: 0.4, url: url(pages.colophon.path) },
    {
      changeFrequency: 'weekly',
      priority: 0.4,
      url: url(pages.guestbook.path),
    },
  ]

  const tags: Entry[] = getTags().map((tag) => ({
    changeFrequency: 'monthly',
    priority: 0.3,
    url: url(`${pages.blog.path}/tags/${tag}`),
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

  return [...staticEntries, ...postEntries, ...workEntries, ...tags]
}
