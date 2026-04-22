import type {
  AboutPage,
  Article,
  BlogPosting,
  BreadcrumbList,
  CollectionPage,
  ContactPage,
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

// --- Page helpers ---

interface PageJsonLdProps {
  breadcrumbs?: { name: string; url: string }[]
  description?: string
  path: string
  title: string
}

function makePageJsonLd<T extends WebPage>(
  type: T['@type'],
  { title, description, path, breadcrumbs: extraCrumbs }: PageJsonLdProps
): { page: T; breadcrumbs: BreadcrumbList } {
  const url = new URL(path, baseUrl.href).href
  const page = {
    '@type': type,
    name: title,
    description,
    url,
    isPartOf: { '@type': 'WebSite', '@id': `${baseUrl.href}#website` },
  } as T

  const crumbs = extraCrumbs ?? [
    { name: homeTitle, url: baseUrl.href },
    { name: title, url },
  ]

  return { page, breadcrumbs: makeBreadcrumbs(crumbs) }
}

// --- Generic web page (fallback) ---

export const WebPageJsonLd = (props: PageJsonLdProps) => {
  const { page, breadcrumbs } = makePageJsonLd<WebPage>('WebPage', props)
  return (
    <JsonLd graph={{ '@context': 'https://schema.org', '@graph': [page, breadcrumbs] }} />
  )
}

// --- Collection page (listings: blog, work, tags) ---

export const CollectionPageJsonLd = (props: PageJsonLdProps) => {
  const { page, breadcrumbs } = makePageJsonLd<CollectionPage>('CollectionPage', props)
  return (
    <JsonLd graph={{ '@context': 'https://schema.org', '@graph': [page, breadcrumbs] }} />
  )
}

// --- Contact page ---

export const ContactPageJsonLd = (props: PageJsonLdProps) => {
  const { page, breadcrumbs } = makePageJsonLd<ContactPage>('ContactPage', props)
  return (
    <JsonLd graph={{ '@context': 'https://schema.org', '@graph': [page, breadcrumbs] }} />
  )
}

// --- About page (colophon, uses) ---

export const AboutPageJsonLd = (props: PageJsonLdProps) => {
  const { page, breadcrumbs } = makePageJsonLd<AboutPage>('AboutPage', props)
  return (
    <JsonLd graph={{ '@context': 'https://schema.org', '@graph': [page, breadcrumbs] }} />
  )
}

// --- Profile page ---

export const ProfilePageJsonLd = (props: PageJsonLdProps) => {
  const { page, breadcrumbs } = makePageJsonLd<ProfilePage>('ProfilePage', props)
  return (
    <JsonLd
      graph={{
        '@context': 'https://schema.org',
        '@graph': [
          { ...page, mainEntity: { '@type': 'Person', '@id': `${baseUrl.href}#person` } },
          breadcrumbs,
        ],
      }}
    />
  )
}

// --- Blog tag page ---

export const TagJsonLd = ({ tag }: { tag: string }) => {
  const tagUrl = new URL(`/blog/tags/${tag}`, baseUrl.href).href
  const tagsUrl = new URL('/blog/tags', baseUrl.href).href

  const page: CollectionPage = {
    '@type': 'CollectionPage',
    name: `Posts tagged "${tag}"`,
    url: tagUrl,
    isPartOf: { '@type': 'WebSite', '@id': `${baseUrl.href}#website` },
  }

  const breadcrumbs = makeBreadcrumbs([
    { name: homeTitle, url: baseUrl.href },
    { name: 'Tags', url: tagsUrl },
    { name: `Posts tagged "${tag}"`, url: tagUrl },
  ])

  return (
    <JsonLd graph={{ '@context': 'https://schema.org', '@graph': [page, breadcrumbs] }} />
  )
}
