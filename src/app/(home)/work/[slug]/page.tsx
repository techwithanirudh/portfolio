import { TOCProvider } from 'fumadocs-ui/components/toc'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { type ReactElement, ViewTransition } from 'react'
import { mdxComponents } from '@/components/content/mdx/components'
import { GitHubCode } from '@/components/content/mdx/github-code'
import { PreviewButton } from '@/components/content/mdx/preview-button'
import { TOCMinimap, TOCPopover } from '@/components/features/toc'
import { Icons } from '@/components/icons/icons'
import { Section } from '@/components/layout/sections/section'
import { SectionBody } from '@/components/layout/sections/section-body'
import { WorkJsonLd } from '@/components/seo/json-ld'
import { BlurImage } from '@/components/shared/blur-image'
import { ViewAnimation } from '@/components/shared/view-animation'
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
    <Section className='p-4 lg:p-6'>
      <div
        className={cn(
          'flex flex-col items-start justify-center gap-4 py-8 md:gap-6',
          'sm:items-center sm:rounded-lg sm:border sm:bg-card sm:p-10 sm:shadow-xs'
        )}
      >
        {page.data.image && (
          <ViewTransition
            name={`${page.slugs.join('/')}-image`}
            share={transition}
          >
            <BlurImage
              alt={page.data.title ?? 'Work cover image'}
              className='relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-card/50 sm:mx-auto'
              fill
              imageClassName='object-cover'
              sizes='(min-width: 1024px) 1200px, 100vw'
              src={page.data.image}
            />
          </ViewTransition>
        )}
        <div className='flex flex-col gap-2 sm:text-center md:gap-4'>
          <ViewTransition
            name={`${page.slugs.join('/')}-title`}
            share={transition}
          >
            <h1 className='typography-hero text-balance font-normal text-3xl leading-tight tracking-tight sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight lg:text-6xl'>
              {page.data.title ?? 'Untitled'}
            </h1>
          </ViewTransition>
          <ViewTransition
            name={`${page.slugs.join('/')}-description`}
            share={transition}
          >
            <p className='typography-body mx-auto text-pretty'>
              {page.data.description ?? ''}
            </p>
          </ViewTransition>
        </div>
        {links.length > 0 && (
          <ViewAnimation
            delay={0.1}
            initial={{ opacity: 0, translateY: -6 }}
            whileInView={{ opacity: 1, translateY: 0 }}
          >
            <div className='flex flex-wrap gap-3'>
              {links.map((link) => (
                <PreviewButton
                  href={link.href}
                  icon={link.icon}
                  key={link.href}
                  label={link.label}
                />
              ))}
            </div>
          </ViewAnimation>
        )}
      </div>
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
      url: `/work/${page.slugs.join('/')}`,
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
