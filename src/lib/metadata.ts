import type { Metadata } from 'next'
import {
  description as homeDescription,
  owner,
  title,
  xHandle,
} from '@/constants/site'
import { env } from '@/env'
import type { BlogPage } from './source/blog'
import type { ProjectPage } from './source/projects'

export const baseUrl =
  env.NODE_ENV === 'development' || !env.NEXT_PUBLIC_BASE_URL
    ? new URL('http://localhost:3000')
    : new URL(env.NEXT_PUBLIC_BASE_URL)

const clamp = (value: string, max: number) =>
  value.length > max ? `${value.slice(0, max - 1).trimEnd()}…` : value

export function clampOgParams(ogTitle: string, description?: string) {
  return {
    description: description ? clamp(description, 320) : undefined,
    title: clamp(ogTitle, 160),
  }
}

export function createMetadata(override: Metadata): Metadata {
  const ogTitle =
    typeof override.title === 'string' ? override.title : undefined
  const ogDesc =
    typeof override.description === 'string' ? override.description : undefined
  const defaultImage = ogTitle
    ? `/og?${new URLSearchParams({
        title: ogTitle,
        ...(ogDesc ? { description: ogDesc } : {}),
      })}`
    : '/banner.png'

  return {
    ...override,
    alternates: {
      types: {
        'application/rss+xml': '/blog/rss.xml',
      },
      ...override.alternates,
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
    },
    creator: owner,
    formatDetection: {
      telephone: false,
      ...override.formatDetection,
    },
    openGraph: {
      description: override.description ?? undefined,
      images: defaultImage,
      locale: 'en_US',
      siteName: title,
      title: override.title ?? undefined,
      type: 'website',
      url: baseUrl.href,
      ...override.openGraph,
    },
    publisher: owner,
    robots: {
      follow: true,
      googleBot: {
        follow: true,
        index: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
      index: true,
      ...(typeof override.robots === 'object' ? override.robots : {}),
    },
    twitter: {
      card: 'summary_large_image',
      creator: `@${xHandle}`,
      description: override.description ?? undefined,
      images: defaultImage,
      title: override.title ?? undefined,
      ...override.twitter,
    },
  }
}

export function createArticleMetadata(
  page: BlogPage | ProjectPage,
  image: { url: string },
  openGraph?: { authors: string[]; tags?: string[] }
): Metadata {
  return createMetadata({
    alternates: {
      canonical: page.url,
    },
    description: page.data.description ?? homeDescription,
    openGraph: {
      ...openGraph,
      images: image.url,
      modifiedTime: (page.data.lastModified ?? page.data.date).toISOString(),
      publishedTime: page.data.date.toISOString(),
      type: 'article',
      url: page.url,
    },
    title: page.data.title,
    twitter: {
      images: image.url,
    },
  })
}

/** The /og/<collection> URL segment; projects keep their published /og/work URLs */
export type OgCollection = 'blog' | 'work'

export function getPageImage(
  collection: OgCollection,
  page: Pick<BlogPage | ProjectPage, 'slugs'>
) {
  const segments = [...page.slugs, 'image.webp']
  return {
    segments,
    url: `/og/${collection}/${segments.join('/')}`,
  }
}

export const getBlogPageImage = (page: BlogPage) => getPageImage('blog', page)

export const getProjectPageImage = (page: ProjectPage) =>
  getPageImage('work', page)
