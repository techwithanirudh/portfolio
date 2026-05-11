import type {
  Article,
  BlogPosting,
  BreadcrumbList,
  CollectionPage,
} from 'schema-dts'
import { baseUrl } from '@/constants'
import { title as homeTitle } from '@/constants/site'
import { getBlogPageImage, getWorkPageImage } from '@/lib/metadata'
import type { BlogPage } from '@/lib/source'
import type { WorkPage } from '@/lib/source/work'

const personRef = {
  '@type': 'Person',
  '@id': `${baseUrl.href}#person`,
} as const

function JsonLd({ graph }: { graph: object }) {
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

function makeGraph(...nodes: object[]) {
  return { '@context': 'https://schema.org', '@graph': nodes }
}

// --- Blog post ---

export const PostJsonLd = ({ page }: { page: BlogPage }) => {
  const url = new URL(page.url, baseUrl.href).href
  const image = new URL(getBlogPageImage(page).url, baseUrl.href).href

  const post: BlogPosting = {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: page.data.title,
    description: page.data.description,
    image,
    url,
    datePublished: new Date(page.data.date).toISOString(),
    dateModified: page.data.lastModified
      ? new Date(page.data.lastModified).toISOString()
      : new Date(page.data.date).toISOString(),
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: page.data.author
      ? { '@type': 'Person', name: page.data.author }
      : personRef,
    publisher: personRef,
    isPartOf: { '@type': 'WebSite', '@id': `${baseUrl.href}#website` },
  }

  const breadcrumbs = makeBreadcrumbs([
    { name: homeTitle, url: baseUrl.href },
    { name: 'Blog', url: new URL('/blog', baseUrl.href).href },
    { name: page.data.title ?? 'Untitled', url },
  ])

  return <JsonLd graph={makeGraph(post, breadcrumbs)} />
}

// --- Work case study ---

export const WorkJsonLd = ({ page }: { page: WorkPage }) => {
  const url = new URL(page.url, baseUrl.href).href
  const image = new URL(getWorkPageImage(page).url, baseUrl.href).href

  const article: Article = {
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: page.data.title,
    description: page.data.description,
    image,
    url,
    datePublished: new Date(page.data.date).toISOString(),
    dateModified: page.data.lastModified
      ? new Date(page.data.lastModified).toISOString()
      : new Date(page.data.date).toISOString(),
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: personRef,
    publisher: personRef,
    isPartOf: { '@type': 'WebSite', '@id': `${baseUrl.href}#website` },
  }

  const breadcrumbs = makeBreadcrumbs([
    { name: homeTitle, url: baseUrl.href },
    { name: 'Work', url: new URL('/work', baseUrl.href).href },
    { name: page.data.title ?? 'Untitled', url },
  ])

  return <JsonLd graph={makeGraph(article, breadcrumbs)} />
}

// --- Page helpers ---

interface PageJsonLdProps {
  breadcrumbs?: { name: string; url: string }[]
  description?: string
  path: string
  title: string
}

type WebPageType =
  | 'WebPage'
  | 'CollectionPage'
  | 'ContactPage'
  | 'AboutPage'
  | 'ProfilePage'

function PageJsonLdBase({
  type,
  props,
  extra,
}: {
  type: WebPageType
  props: PageJsonLdProps
  extra?: object
}) {
  const { title, description, path, breadcrumbs: extraCrumbs } = props
  const url = new URL(path, baseUrl.href).href

  const page = {
    '@type': type,
    '@id': `${url}#webpage`,
    name: title,
    ...(description && { description }),
    url,
    isPartOf: { '@type': 'WebSite', '@id': `${baseUrl.href}#website` },
    ...extra,
  }

  const crumbs = extraCrumbs ?? [
    { name: homeTitle, url: baseUrl.href },
    { name: title, url },
  ]

  return <JsonLd graph={makeGraph(page, makeBreadcrumbs(crumbs))} />
}

// --- Generic web page (fallback) ---

export const WebPageJsonLd = (props: PageJsonLdProps) => (
  <PageJsonLdBase props={props} type='WebPage' />
)

// --- Collection page (listings: blog, work, tags) ---

export const CollectionPageJsonLd = (props: PageJsonLdProps) => (
  <PageJsonLdBase props={props} type='CollectionPage' />
)

// --- Contact page ---

export const ContactPageJsonLd = (props: PageJsonLdProps) => (
  <PageJsonLdBase props={props} type='ContactPage' />
)

// --- About page (colophon, uses) ---

export const AboutPageJsonLd = (props: PageJsonLdProps) => (
  <PageJsonLdBase props={props} type='AboutPage' />
)

// --- Profile page ---

export const ProfilePageJsonLd = (props: PageJsonLdProps) => (
  <PageJsonLdBase
    extra={{
      mainEntity: { '@type': 'Person', '@id': `${baseUrl.href}#person` },
    }}
    props={props}
    type='ProfilePage'
  />
)

// --- Blog tag page ---

export const TagJsonLd = ({ tag }: { tag: string }) => {
  const tagUrl = new URL(`/blog/tags/${tag}`, baseUrl.href).href
  const tagsUrl = new URL('/blog/tags', baseUrl.href).href

  const page: CollectionPage = {
    '@type': 'CollectionPage',
    '@id': `${tagUrl}#webpage`,
    name: `Posts tagged "${tag}"`,
    url: tagUrl,
    isPartOf: { '@type': 'WebSite', '@id': `${baseUrl.href}#website` },
  }

  const breadcrumbs = makeBreadcrumbs([
    { name: homeTitle, url: baseUrl.href },
    { name: 'Tags', url: tagsUrl },
    { name: `Posts tagged "${tag}"`, url: tagUrl },
  ])

  return <JsonLd graph={makeGraph(page, breadcrumbs)} />
}
