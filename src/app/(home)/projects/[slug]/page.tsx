import { TOCProvider } from 'fumadocs-ui/components/toc'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { type ReactElement, ViewTransition } from 'react'
import { BlurImage } from '@/components/blur-image'
import { mdxComponents } from '@/components/content/mdx/components'
import { GitHubCode } from '@/components/content/mdx/github-code'
import { PROJECT_COVER_SIZES } from '@/components/features/projects/cover'
import { PreviewButton } from '@/components/features/projects/preview-button'
import {
  projectTransitionName,
  projectTransitionShare,
} from '@/components/features/projects/transition'
import { TOCMinimap, TOCPopover } from '@/components/features/toc'
import { Icons } from '@/components/icons/icons'
import { ProjectJsonLd } from '@/components/json-ld'
import { Section } from '@/components/layout/sections'
import { Prose } from '@/components/prose'
import { ViewAnimation } from '@/components/view-animation'
import { createArticleMetadata, getProjectPageImage } from '@/lib/metadata'
import { getProject, getProjectPages, type ProjectPage } from '@/lib/source'
import { cn } from '@/lib/utils'

function Header(props: { page: ProjectPage }) {
  const { page } = props
  const links: { href: string; label: string; icon: ReactElement }[] = []

  if (page.data.website) {
    links.push({
      href: page.data.website,
      icon: <Icons.globe className='size-4' />,
      label: 'Visit website',
    })
  }

  if (page.data.github) {
    links.push({
      href: page.data.github,
      icon: <Icons.github className='size-4' />,
      label: 'View source',
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
            name={projectTransitionName(page.slugs.join('/'), 'image')}
            share={projectTransitionShare}
          >
            <BlurImage
              alt=''
              blur={false}
              className='relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-card/50 sm:mx-auto'
              fill
              imageClassName='object-cover'
              loading='eager'
              sizes={PROJECT_COVER_SIZES}
              src={page.data.image}
            />
          </ViewTransition>
        )}
        <div className='flex flex-col gap-2 sm:text-center md:gap-4'>
          <ViewTransition
            name={projectTransitionName(page.slugs.join('/'), 'title')}
            share={projectTransitionShare}
          >
            <h1 className='typography-hero text-balance font-normal text-3xl leading-tight tracking-tight sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight lg:text-6xl'>
              {page.data.title}
            </h1>
          </ViewTransition>
          <ViewTransition
            name={projectTransitionName(page.slugs.join('/'), 'description')}
            share={projectTransitionShare}
          >
            <p className='typography-body mx-auto text-pretty'>
              {page.data.description}
            </p>
          </ViewTransition>
        </div>
        {links.length > 0 && (
          <ViewAnimation delay={0.1}>
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
  const page = getProject([params.slug])

  if (!page) {
    notFound()
  }
  const { body: Mdx, toc } = page.data

  return (
    <TOCProvider toc={toc}>
      <Header page={page} />

      <Section className='flex' fill>
        <TOCMinimap items={toc} />
        <article className='flex min-h-full min-w-0 flex-1 flex-col'>
          <TOCPopover items={toc} />
          <Prose className='min-w-0 flex-1 p-4'>
            <Mdx components={{ ...mdxComponents, GitHubCode }} />
          </Prose>
        </article>
      </Section>
      <ProjectJsonLd page={page} />
    </TOCProvider>
  )
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const params = await props.params
  const page = getProject([params.slug])

  if (!page) {
    notFound()
  }

  return createArticleMetadata(page, getProjectPageImage(page))
}

export function generateStaticParams(): { slug: string }[] {
  return getProjectPages().flatMap(({ slugs: [slug] }) =>
    slug ? [{ slug }] : []
  )
}
