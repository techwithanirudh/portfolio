import { TOCProvider } from 'fumadocs-ui/components/toc'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ViewTransition } from 'react'
import { BlurImage } from '@/components/blur-image'
import { mdxComponents } from '@/components/content/mdx/components'
import { GitHubCode } from '@/components/content/mdx/github-code'
import { PROJECT_COVER_SIZES } from '@/components/features/projects/cover'
import { ProjectFacts } from '@/components/features/projects/project-facts'
import { ProjectStatus } from '@/components/features/projects/project-status'
import {
  projectTransitionName,
  projectTransitionShare,
} from '@/components/features/projects/transition'
import { TOCPopover } from '@/components/features/toc'
import { ProjectJsonLd } from '@/components/json-ld'
import { Section } from '@/components/layout/sections'
import { heroTitleClassName, TitleDot } from '@/components/layout/sections/hero'
import { Prose } from '@/components/prose'
import { createArticleMetadata, getProjectPageImage } from '@/lib/metadata'
import { hasStatusStrip } from '@/lib/project-links'
import { getProject, getProjectPages, type ProjectPage } from '@/lib/source'

function Header({ page }: { page: ProjectPage }) {
  const slug = page.slugs.join('/')

  return (
    <header className='flex flex-col gap-4 px-6 pt-8 pb-6 lg:pt-12'>
      <ViewTransition
        name={projectTransitionName(slug, 'title')}
        share={projectTransitionShare}
      >
        <h1 className={heroTitleClassName}>
          {page.data.title}
          <TitleDot />
        </h1>
      </ViewTransition>
      <ViewTransition
        name={projectTransitionName(slug, 'description')}
        share={projectTransitionShare}
      >
        <p className='text-pretty text-lg text-muted-foreground leading-relaxed tracking-tight'>
          {page.data.description}
        </p>
      </ViewTransition>
      {hasStatusStrip(page) && <ProjectStatus page={page} />}
      {page.data.image && (
        <ViewTransition
          name={projectTransitionName(slug, 'image')}
          share={projectTransitionShare}
        >
          <BlurImage
            alt=''
            blur={false}
            className='relative mt-4 aspect-video w-full overflow-hidden rounded-xl bg-card outline outline-black/10 -outline-offset-1 dark:outline-white/10'
            fill
            imageClassName='object-contain object-top'
            loading='eager'
            sizes={PROJECT_COVER_SIZES}
            src={page.data.image}
          />
        </ViewTransition>
      )}
    </header>
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
      <Section
        className='grid grid-rows-[auto_auto_1fr] md:grid-cols-[minmax(0,1fr)_20rem] md:grid-rows-[auto_1fr]'
        fill
      >
        <Header page={page} />
        <aside className='border-t border-dashed px-6 py-8 md:col-start-2 md:row-span-2 md:row-start-1 md:border-t-0 md:border-l md:px-7 lg:py-12'>
          <div className='md:sticky md:top-20'>
            <ProjectFacts page={page} />
          </div>
        </aside>
        <article className='flex min-w-0 flex-col border-t border-dashed md:col-start-1 md:border-t-0'>
          <TOCPopover className='md:hidden!' items={toc} />
          <Prose className='prose-h2:mt-10 prose-h2:mb-3.5 px-6 pt-6 pb-12 prose-h2:text-[1.375rem] md:pt-2'>
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
