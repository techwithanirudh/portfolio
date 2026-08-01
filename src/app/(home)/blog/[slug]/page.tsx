import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ShareMenu } from '@/app/(home)/blog/[slug]/page.client'
import { LLMCopyButtonWithViewOptions } from '@/components/ai/page-actions'
import {
  BlogTocDesktop,
  BlogTocMobile,
  BlogTocProvider,
} from '@/components/blog-toc'
import { PostJsonLd } from '@/components/json-ld'
import { mdxComponents } from '@/components/mdx/components'
import { GitHubCode } from '@/components/mdx/github-code'
import { MdxContent } from '@/components/mdx-layout'
import { SectionBody } from '@/components/section-body'
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
  const { body: Mdx, toc, tags, lastModified } = page.data

  const lastUpdate = lastModified ? new Date(lastModified) : undefined

  return (
    <BlogTocProvider toc={toc}>
      <Header page={page} tags={tags} />

      <BlogTocDesktop />
      <BlogTocMobile />

      <SectionBody>
        <article className='flex min-h-full flex-col pt-16 lg:flex-row'>
          <MdxContent
            comments
            hideInlineToc
            proseClassName='pt-4 lg:pt-0'
            slug={params.slug}
            toc={toc}
          >
            <Mdx components={{ ...mdxComponents, GitHubCode }} />
          </MdxContent>
          <div className='lg:supports-timeline-scroll:scroll-fade-effect-y flex flex-col gap-4 p-4 text-sm lg:sticky lg:top-[4rem] lg:h-[calc(100vh-4rem)] lg:w-[250px] lg:self-start lg:overflow-y-auto lg:border-border lg:border-l lg:border-dashed'>
            <div>
              <p className='mb-1 text-muted-foreground text-sm'>Written by</p>
              <p className='font-medium'>{page.data.author ?? 'Unknown'}</p>
            </div>
            <div>
              <p className='mb-1 text-muted-foreground text-sm'>Created At</p>
              <p className='font-medium'>
                {new Date(page.data.date).toDateString()}
              </p>
            </div>
            {lastUpdate && (
              <div>
                <p className='mb-1 text-muted-foreground text-sm'>Updated At</p>
                <p className='font-medium'>{lastUpdate.toDateString()}</p>
              </div>
            )}
            <div className='flex flex-col gap-2'>
              <LLMCopyButtonWithViewOptions
                githubUrl={`https://github.com/${owner}/${repo}/blob/main/content/blog/${params.slug}.mdx`}
                markdownUrl={`/blog.mdx/${params.slug}`}
              />
              <ShareMenu title={page.data.title ?? 'Untitled'} url={page.url} />
            </div>
          </div>
        </article>
      </SectionBody>
      <PostJsonLd page={page} />
    </BlogTocProvider>
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
