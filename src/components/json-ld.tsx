import type {
  Article,
  BlogPosting,
  BreadcrumbList,
  Graph,
  ProfilePage,
  WebPage,
} from 'schema-dts'
import { baseUrl } from '@/constants'
import { title as homeTitle, owner } from '@/constants/site'
import { getBlogPageImage, getWorkPageImage } from '@/lib/metadata'
import type { BlogPage } from '@/lib/source'
import type { WorkPage } from '@/lib/source/work'

function JsonLd({ graph }: { graph: Graph }) {
  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires inline script content
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph).replace(/</g, '\\u003c'),
      }}
      type='application/ld+json'
    />
  )
}

function makeBreadcrumbs(
  items: { name: string; url: string }[]
): BreadcrumbList {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

// --- Blog post ---

export const PostJsonLd = ({ page }: { page: BlogPage }) => {
  const url = new URL(page.url, baseUrl.href).href
  const image = new URL(getBlogPageImage(page).url, baseUrl.href).href

  const post: BlogPosting = {
    '@type': 'BlogPosting',
    headline: page.data.title,
    description: page.data.description,
    image,
    url,
    datePublished: new Date(page.data.date).toISOString(),
    dateModified: page.data.lastModified
      ? new Date(page.data.lastModified).toISOString()
      : new Date(page.data.date).toISOString(),
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: {
      '@type': 'Person',
      name: page.data.author ?? owner,
      url: baseUrl.href,
    },
    publisher: {
      '@type': 'Person',
      name: owner,
      url: baseUrl.href,
    },
  }

  const breadcrumbs = makeBreadcrumbs([
    { name: homeTitle, url: baseUrl.href },
    { name: 'Blog', url: new URL('/blog', baseUrl.href).href },
    { name: page.data.title ?? 'Untitled', url },
  ])

  return (
    <JsonLd
      graph={{
        '@context': 'https://schema.org',
        '@graph': [post, breadcrumbs],
      }}
    />
  )
}

// --- Work case study ---

export const WorkJsonLd = ({ page }: { page: WorkPage }) => {
  const url = new URL(page.url, baseUrl.href).href
  const image = new URL(getWorkPageImage(page).url, baseUrl.href).href

  const article: Article = {
    '@type': 'Article',
    headline: page.data.title,
    description: page.data.description,
    image,
    url,
    datePublished: new Date(page.data.date).toISOString(),
    dateModified: page.data.lastModified
      ? new Date(page.data.lastModified).toISOString()
      : new Date(page.data.date).toISOString(),
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: { '@type': 'Person', name: owner, url: baseUrl.href },
    publisher: { '@type': 'Person', name: owner, url: baseUrl.href },
  }

  const breadcrumbs = makeBreadcrumbs([
    { name: homeTitle, url: baseUrl.href },
    { name: 'Work', url: new URL('/work', baseUrl.href).href },
    { name: page.data.title ?? 'Untitled', url },
  ])

  return (
    <JsonLd
      graph={{
        '@context': 'https://schema.org',
        '@graph': [article, breadcrumbs],
      }}
    />
  )
}

// --- Generic web page ---

export const WebPageJsonLd = ({
  title,
  description,
  path,
}: {
  title: string
  description?: string
  path: string
}) => {
  const url = new URL(path, baseUrl.href).href

  const webPage: WebPage = {
    '@type': 'WebPage',
    name: title,
    description,
    url,
    isPartOf: { '@type': 'WebSite', '@id': `${baseUrl.href}#website` },
  }

  const breadcrumbs = makeBreadcrumbs([
    { name: homeTitle, url: baseUrl.href },
    { name: title, url },
  ])

  return (
    <JsonLd
      graph={{
        '@context': 'https://schema.org',
        '@graph': [webPage, breadcrumbs],
      }}
    />
  )
}

// --- Profile page ---

export const ProfilePageJsonLd = ({
  title,
  description,
  path,
}: {
  title: string
  description?: string
  path: string
}) => {
  const url = new URL(path, baseUrl.href).href

  const profilePage: ProfilePage = {
    '@type': 'ProfilePage',
    name: title,
    description,
    url,
    isPartOf: { '@type': 'WebSite', '@id': `${baseUrl.href}#website` },
    mainEntity: { '@type': 'Person', '@id': `${baseUrl.href}#person` },
  }

  const breadcrumbs = makeBreadcrumbs([
    { name: homeTitle, url: baseUrl.href },
    { name: title, url },
  ])

  return (
    <JsonLd
      graph={{
        '@context': 'https://schema.org',
        '@graph': [profilePage, breadcrumbs],
      }}
    />
  )
}

// --- Blog tag page ---

export const TagJsonLd = ({ tag }: { tag: string }) => {
  const breadcrumbs = makeBreadcrumbs([
    { name: homeTitle, url: baseUrl.href },
    { name: 'Tags', url: new URL('/blog/tags', baseUrl.href).href },
    {
      name: `Posts tagged "${tag}"`,
      url: new URL(`/blog/tags/${tag}`, baseUrl.href).href,
    },
  ])

  return (
    <JsonLd
      graph={{ '@context': 'https://schema.org', '@graph': [breadcrumbs] }}
    />
  )
}
