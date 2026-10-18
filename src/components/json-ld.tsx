import type {
  Article,
  BreadcrumbList,
  CollectionPage,
  Graph,
  Thing,
} from 'schema-dts'
import { tagPath } from '@/components/features/blog/tag-path'
import { pages } from '@/constants/pages'
import { title as homeTitle } from '@/constants/site'
import { baseUrl, getBlogPageImage, getWorkPageImage } from '@/lib/metadata'
import type { BlogPage } from '@/lib/source'
import type { WorkPage } from '@/lib/source/work'
import { url as siteUrl } from '@/lib/url'

const personRef = {
  '@id': `${baseUrl.href}#person`,
  '@type': 'Person',
} as const

const websiteRef = {
  '@id': `${baseUrl.href}#website`,
  '@type': 'WebSite',
} as const

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
      item: item.url,
      name: item.name,
      position: i + 1,
    })),
  }
}

function makeGraph(...nodes: Thing[]): Graph {
  return { '@context': 'https://schema.org', '@graph': nodes }
}

function ArticleJsonLd({
  author,
  image,
  page,
  section,
  type,
}: {
  author: Article['author']
  image: string
  page: BlogPage | WorkPage
  section: { name: string; path: string }
  type: 'Article' | 'BlogPosting'
}) {
  const url = siteUrl(page.url)

  const article: Article = {
    '@id': `${url}#article`,
    '@type': type,
    author,
    dateModified: (page.data.lastModified ?? page.data.date).toISOString(),
    datePublished: page.data.date.toISOString(),
    description: page.data.description,
    headline: page.data.title,
    image,
    isPartOf: websiteRef,
    mainEntityOfPage: { '@id': url, '@type': 'WebPage' },
    publisher: personRef,
    url,
  }

  const breadcrumbs = makeBreadcrumbs([
    { name: homeTitle, url: baseUrl.href },
    { name: section.name, url: siteUrl(section.path) },
    { name: page.data.title, url },
  ])

  return <JsonLd graph={makeGraph(article, breadcrumbs)} />
}

export const PostJsonLd = ({ page }: { page: BlogPage }) => (
  <ArticleJsonLd
    author={{ '@type': 'Person', name: page.data.author }}
    image={siteUrl(getBlogPageImage(page).url)}
    page={page}
    section={{ name: pages.blog.title, path: pages.blog.path }}
    type='BlogPosting'
  />
)

export const WorkJsonLd = ({ page }: { page: WorkPage }) => (
  <ArticleJsonLd
    author={personRef}
    image={siteUrl(getWorkPageImage(page).url)}
    page={page}
    section={{ name: pages.projects.title, path: pages.projects.path }}
    type='Article'
  />
)

interface PageJsonLdProps {
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
  // TODO(slopradar): weak-type: extra?: object lets any field into the graph unchecked, and the page node is an untyped literal while ArticleJsonLd types its node as schema-dts Article; type the node as WebPage and extra as Partial<WebPage>
  extra?: object
}) {
  const { title, description, path } = props
  const url = siteUrl(path)

  const page = {
    '@id': `${url}#webpage`,
    '@type': type,
    name: title,
    ...(description && { description }),
    isPartOf: websiteRef,
    url,
    ...extra,
  }

  const crumbs = [
    { name: homeTitle, url: baseUrl.href },
    { name: title, url },
  ]

  return <JsonLd graph={makeGraph(page, makeBreadcrumbs(crumbs))} />
}

// TODO(slopradar): pass-through-wrapper: five one-line wrappers only pin `type`, export PageJsonLdBase as PageJsonLd with a type prop and pass the type at each page
export const WebPageJsonLd = (props: PageJsonLdProps) => (
  <PageJsonLdBase props={props} type='WebPage' />
)

export const CollectionPageJsonLd = (props: PageJsonLdProps) => (
  <PageJsonLdBase props={props} type='CollectionPage' />
)

export const ContactPageJsonLd = (props: PageJsonLdProps) => (
  <PageJsonLdBase props={props} type='ContactPage' />
)

export const AboutPageJsonLd = (props: PageJsonLdProps) => (
  <PageJsonLdBase props={props} type='AboutPage' />
)

export const ProfilePageJsonLd = (props: PageJsonLdProps) => (
  <PageJsonLdBase
    extra={{
      mainEntity: personRef,
    }}
    props={props}
    type='ProfilePage'
  />
)

export const TagJsonLd = ({ tag }: { tag: string }) => {
  const tagUrl = siteUrl(tagPath(tag))
  const blogUrl = siteUrl(pages.blog.path)

  const page: CollectionPage = {
    '@id': `${tagUrl}#webpage`,
    '@type': 'CollectionPage',
    isPartOf: websiteRef,
    name: `Posts tagged "${tag}"`,
    url: tagUrl,
  }

  const breadcrumbs = makeBreadcrumbs([
    { name: homeTitle, url: baseUrl.href },
    { name: pages.blog.title, url: blogUrl },
    { name: `Posts tagged "${tag}"`, url: tagUrl },
  ])

  return <JsonLd graph={makeGraph(page, breadcrumbs)} />
}
