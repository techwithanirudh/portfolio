import { TOCProvider } from 'fumadocs-ui/components/toc'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { type ReactElement, ViewTransition } from 'react'
import { BackLink } from '@/components/back-link'
import { BlurImage } from '@/components/blur-image'
import { mdxComponents } from '@/components/content/mdx/components'
import { GitHubCode } from '@/components/content/mdx/github-code'
import { TOCMinimap, TOCPopover } from '@/components/features/toc'
import { WORK_COVER_SIZES } from '@/components/features/work/cover'
import { PreviewButton } from '@/components/features/work/preview-button'
import { Icons } from '@/components/icons/icons'
import { WorkJsonLd } from '@/components/json-ld'
import { Section } from '@/components/layout/sections'
import { SectionBody } from '@/components/layout/sections/body'
import { description as homeDescription } from '@/constants/site'
import { createMetadata, getWorkPageImage } from '@/lib/metadata'
import { getWork, getWorkPages, type WorkPage as MDXPage } from '@/lib/source'
import { cn } from '@/lib/utils'

const transition = { default: 'none', 'work-card': 'via-blur' } as const

function Header(props: { page: MDXPage }) {
  const { page } = props
  const links: { href: string; label: string; icon: ReactElement }[] = []

  if (page.data.website) {
    links.push({
      href: page.data.website,
      icon: <Icons.globe className='size-4' />,
      label: 'Visit Website',
    })
  }

  if (page.data.github) {
    links.push({
      href: page.data.github,
      icon: <Icons.github className='size-4' />,
      label: 'View Source',
    })
  }

  return (
    <Section className='screen-line-top-none'>
      <div className='flex h-10 items-stretch justify-between gap-2'>
        <BackLink className='px-4' href='/projects'>
          Projects
        </BackLink>
        {links.length > 0 && (
          <div className='flex items-stretch border-line border-l'>
            {links.map((link, index) => (
              <PreviewButton
                className={cn(index > 0 && 'border-line border-l border-solid')}
                href={link.href}
                icon={link.icon}
                key={link.href}
                label={link.label}
              />
            ))}
          </div>
        )}
      </div>
      <ViewTransition name={`${page.slugs.join('/')}-title`} share={transition}>
        <h1 className='screen-line-top screen-line-bottom text-balance px-4 py-2 font-heading font-medium text-3xl tracking-tight sm:text-4xl'>
          {page.data.title ?? 'Untitled'}
        </h1>
      </ViewTransition>
      <ViewTransition
        name={`${page.slugs.join('/')}-description`}
        share={transition}
      >
        <p className='screen-line-bottom text-pretty p-4 text-muted-foreground'>
          {page.data.description ?? ''}
        </p>
      </ViewTransition>
      {page.data.image && (
        <ViewTransition
          name={`${page.slugs.join('/')}-image`}
          share={transition}
        >
          <BlurImage
            alt={page.data.title ?? 'Work cover image'}
            blur={false}
            className='relative aspect-video w-full border-line border-b bg-card/50'
            fill
            imageClassName='object-cover'
            lazy={false}
            sizes={WORK_COVER_SIZES}
            src={page.data.image}
          />
        </ViewTransition>
      )}
    </Section>
  )
}

export default async function Page(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const page = getWork([params.slug])

  if (!page) {
    notFound()
  }
  const { body: Mdx, toc } = page.data

  return (
    <TOCProvider toc={toc}>
      <Header page={page} />

      <SectionBody className='flex'>
        <TOCMinimap items={toc} />
        <article className='flex min-h-full min-w-0 flex-1 flex-col'>
          <TOCPopover items={toc} />
          <div className='prose prose-zinc dark:prose-invert prose-content min-w-0 flex-1 p-4'>
            <Mdx components={{ ...mdxComponents, GitHubCode }} />
          </div>
        </article>
      </SectionBody>
      <WorkJsonLd page={page} />
    </TOCProvider>
  )
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const params = await props.params
  const page = getWork([params.slug])

  if (!page) {
    notFound()
  }

  const title = page.data.title
  const description = page.data.description ?? homeDescription
  const image = getWorkPageImage(page)

  return createMetadata({
    alternates: {
      canonical: page.url,
    },
    description,
    openGraph: {
      images: image.url,
      modifiedTime: page.data.lastModified
        ? new Date(page.data.lastModified).toISOString()
        : new Date(page.data.date).toISOString(),
      publishedTime: new Date(page.data.date).toISOString(),
      type: 'article',
      url: `/projects/${page.slugs.join('/')}`,
    },
    title,
    twitter: {
      images: image.url,
    },
  })
}

export function generateStaticParams(): { slug: string | undefined }[] {
  return getWorkPages().map((page) => ({
    slug: page.slugs[0],
  }))
}
