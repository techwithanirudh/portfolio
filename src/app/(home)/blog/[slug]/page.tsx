import { TOCProvider } from 'fumadocs-ui/components/toc'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ShareMenu } from '@/app/(home)/blog/[slug]/page.client'
import { mdxComponents } from '@/components/content/mdx/components'
import { GitHubCode } from '@/components/content/mdx/github-code'
import { MdxContent } from '@/components/content/mdx/layout'
import { AuthorByline } from '@/components/features/blog/author-byline'
import { TOCMinimap, TOCPopover } from '@/components/features/toc'
import { PostJsonLd } from '@/components/json-ld'
import { Section } from '@/components/layout/sections'
import { LLMCopyButtonWithViewOptions } from '@/components/page-actions'
import { githubBranch, githubRepoUrl } from '@/constants/config'
import { formatDate } from '@/lib/format-date'
import { getContentSourcePath } from '@/lib/get-llm-text'
import { createArticleMetadata, getBlogPageImage } from '@/lib/metadata'
import { getPost, getPosts } from '@/lib/source'
import { url } from '@/lib/url'
import { Header } from './_components/header'

export default async function Page(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const page = getPost([params.slug])

  if (!page) {
    notFound()
  }
  const { body: Mdx, toc, lastModified } = page.data

  const pageActions = (
    <>
      <div>
        <p className='mb-1 text-muted-foreground text-sm'>Written by</p>
        <p className='font-medium'>
          <AuthorByline author={page.data.author} />
        </p>
      </div>
      <div>
        <p className='mb-1 text-muted-foreground text-sm'>Published</p>
        <p className='font-medium'>{formatDate(page.data.date)}</p>
      </div>
      {lastModified && (
        <div>
          <p className='mb-1 text-muted-foreground text-sm'>Updated</p>
          <p className='font-medium'>{formatDate(lastModified)}</p>
        </div>
      )}
      <div className='flex flex-col gap-2'>
        <LLMCopyButtonWithViewOptions
          githubUrl={`${githubRepoUrl}/blob/${githubBranch}/${getContentSourcePath('blog', page)}`}
          markdownUrl={url(['blog.mdx', params.slug])}
        />
        <ShareMenu title={page.data.title} url={url(page.url)} />
      </div>
    </>
  )

  return (
    <TOCProvider toc={toc}>
      <Header page={page} />

      <Section className='flex' fill>
        <TOCMinimap items={toc} />
        <article className='flex min-h-full min-w-0 flex-1 flex-col lg:flex-row'>
          <div className='flex min-w-0 flex-1 flex-col'>
            <TOCPopover items={toc} />
            <MdxContent
              beforeComments={
                <aside className='flex flex-col gap-4 border-border border-t border-dashed p-4 text-sm lg:hidden'>
                  {pageActions}
                </aside>
              }
              proseClassName='pt-4'
              slug={params.slug}
            >
              <Mdx components={{ ...mdxComponents, GitHubCode }} />
            </MdxContent>
          </div>
          <div className='lg:supports-timeline-scroll:scroll-fade-effect-y hidden flex-col gap-4 p-4 text-sm lg:sticky lg:top-14 lg:flex lg:h-[calc(100dvh-3.5rem)] lg:w-[250px] lg:self-start lg:overflow-y-auto lg:border-l lg:border-dashed'>
            {pageActions}
          </div>
        </article>
      </Section>
      <PostJsonLd page={page} />
    </TOCProvider>
  )
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const params = await props.params
  const page = getPost([params.slug])

  if (!page) {
    notFound()
  }

  return createArticleMetadata(page, getBlogPageImage(page), {
    authors: [page.data.author],
    tags: page.data.tags,
  })
}

export function generateStaticParams(): { slug: string }[] {
  return getPosts().flatMap(({ slugs: [slug] }) => (slug ? [{ slug }] : []))
}
