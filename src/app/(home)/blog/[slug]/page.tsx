import { TOCProvider } from 'fumadocs-ui/components/toc'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ShareMenu } from '@/app/(home)/blog/[slug]/page.client'
import { mdxComponents } from '@/components/content/mdx/components'
import { GitHubCode } from '@/components/content/mdx/github-code'
import { MdxContent } from '@/components/content/mdx/layout'
import { TOCMinimap, TOCPopover } from '@/components/features/toc'
import { PostJsonLd } from '@/components/json-ld'
import { SectionBody } from '@/components/layout/sections/body'
import { LLMCopyButtonWithViewOptions } from '@/components/page-actions'
import { baseUrl } from '@/constants'
import { owner, repo } from '@/constants/config/github'
import { description as homeDescription } from '@/constants/site'
import { createMetadata, getBlogPageImage } from '@/lib/metadata'
import { getPost, getPosts } from '@/lib/source'
import { Header } from './_components/header'

export default async function Page(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const page = getPost([params.slug])

  if (!page) {
    notFound()
  }
  const { body: Mdx, toc, tags } = page.data

  const pageActions = (
    <>
      <LLMCopyButtonWithViewOptions
        githubUrl={`https://github.com/${owner}/${repo}/blob/main/content/blog/${params.slug}.mdx`}
        markdownUrl={new URL(`/blog.mdx/${params.slug}`, baseUrl).toString()}
      />
      <ShareMenu
        title={page.data.title ?? 'Untitled'}
        url={new URL(page.url, baseUrl).toString()}
      />
    </>
  )

  return (
    <TOCProvider toc={toc}>
      <Header actions={pageActions} page={page} tags={tags} />

      <SectionBody className='flex'>
        <TOCMinimap items={toc} />
        <article className='flex min-h-full min-w-0 flex-1 flex-col'>
          <TOCPopover items={toc} />
          <MdxContent comments proseClassName='pt-4' slug={params.slug}>
            <Mdx components={{ ...mdxComponents, GitHubCode }} />
          </MdxContent>
        </article>
      </SectionBody>
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

  const title = page.data.title ?? 'Untitled'
  const description = page.data.description ?? homeDescription

  const image = getBlogPageImage(page)

  return createMetadata({
    alternates: {
      canonical: page.url,
    },
    description,
    openGraph: {
      authors: [page.data.author ?? owner],
      images: image.url,
      modifiedTime: page.data.lastModified
        ? new Date(page.data.lastModified).toISOString()
        : new Date(page.data.date).toISOString(),
      publishedTime: new Date(page.data.date).toISOString(),
      tags: page.data.tags,
      type: 'article',
      url: `/blog/${page.slugs.join('/')}`,
    },
    title,
    twitter: {
      images: image.url,
    },
  })
}

export function generateStaticParams(): { slug: string }[] {
  return getPosts()
    .map((page) => ({ slug: page.slugs[0] }))
    .filter((p): p is { slug: string } => p.slug !== undefined)
}
