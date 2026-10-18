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
import { SectionBody } from '@/components/layout/sections/body'
import { LLMCopyButtonWithViewOptions } from '@/components/page-actions'
import { githubBranch, githubRepoUrl } from '@/constants/config'
import { description as homeDescription } from '@/constants/site'
import { formatDate } from '@/lib/format-date'
import { createMetadata, getBlogPageImage } from '@/lib/metadata'
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
  const { body: Mdx, toc, tags, lastModified } = page.data

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
          githubUrl={`${githubRepoUrl}/blob/${githubBranch}/content/blog/${params.slug}.mdx`}
          markdownUrl={url(['blog.mdx', params.slug])}
        />
        <ShareMenu title={page.data.title} url={url(page.url)} />
      </div>
    </>
  )

  return (
    <TOCProvider toc={toc}>
      <Header page={page} tags={tags} />

      <SectionBody className='flex'>
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
              comments
              proseClassName='pt-4'
              slug={params.slug}
            >
              <Mdx components={{ ...mdxComponents, GitHubCode }} />
            </MdxContent>
          </div>
          <div className='lg:supports-timeline-scroll:scroll-fade-effect-y hidden flex-col gap-4 p-4 text-sm lg:sticky lg:top-14 lg:flex lg:h-[calc(100dvh-3.5rem)] lg:w-[250px] lg:self-start lg:overflow-y-auto lg:border-border lg:border-l lg:border-dashed'>
            {pageActions}
          </div>
        </article>
      </SectionBody>
      <PostJsonLd page={page} />
    </TOCProvider>
  )
}

// TODO(slopradar): duplicate-logic: near-identical to generateMetadata in projects/[slug]/page.tsx, add a createArticleMetadata(page, image) helper in @/lib/metadata
export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const params = await props.params
  const page = getPost([params.slug])

  if (!page) {
    notFound()
  }

  const title = page.data.title
  const description = page.data.description ?? homeDescription

  const image = getBlogPageImage(page)

  return createMetadata({
    alternates: {
      canonical: page.url,
    },
    description,
    openGraph: {
      authors: [page.data.author],
      images: image.url,
      modifiedTime: (page.data.lastModified ?? page.data.date).toISOString(),
      publishedTime: page.data.date.toISOString(),
      tags: page.data.tags,
      type: 'article',
      url: page.url,
    },
    title,
    twitter: {
      images: image.url,
    },
  })
}

export function generateStaticParams(): { slug: string }[] {
  return getPosts().flatMap(({ slugs: [slug] }) => (slug ? [{ slug }] : []))
}
