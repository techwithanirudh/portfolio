import type { Metadata } from 'next'
import { PostIndex } from '@/app/(home)/blog/_components/post-index'
import { tagPath } from '@/components/features/blog/tag-path'
import { TagJsonLd } from '@/components/json-ld'
import { HeroSection } from '@/components/layout/sections/hero'
import { Wrapper } from '@/components/layout/wrapper'
import { createMetadata } from '@/lib/metadata'
import { getPostsByTag, getTags } from '@/lib/source'

export const dynamicParams = false

interface Props {
  params: Promise<{ tag: string }>
}

const pluralizePosts = (count: number) =>
  `${count} ${count === 1 ? 'post' : 'posts'}`

export default async function Page(props: Props) {
  const { tag } = await props.params
  const posts = getPostsByTag(tag)

  return (
    <Wrapper>
      <HeroSection
        caption={
          <span className='font-mono text-sm'>
            {pluralizePosts(posts.length)}
          </span>
        }
        title={tag}
      />
      <PostIndex activeTag={tag} posts={posts} />
      <TagJsonLd tag={tag} />
    </Wrapper>
  )
}

export const generateStaticParams = () => getTags().map((tag) => ({ tag }))

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { tag } = await props.params
  const canonicalUrl = tagPath(tag)

  return createMetadata({
    alternates: {
      canonical: canonicalUrl,
    },
    description: `Blog posts tagged ${tag}, grouped by year.`,
    openGraph: {
      url: canonicalUrl,
    },
    title: `${tag} posts`,
  })
}
