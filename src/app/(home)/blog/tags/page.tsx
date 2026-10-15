import type { Metadata } from 'next'
import Link from 'next/link'
import { Icons } from '@/components/icons/icons'
import { CollectionPageJsonLd } from '@/components/json-ld'
import { Section } from '@/components/layout/sections'
import { Wrapper } from '@/components/layout/wrapper'
import { ViewAnimation } from '@/components/view-animation'
import { title as homeTitle } from '@/constants/site'
import { createMetadata } from '@/lib/metadata'
import { getPostsByTag, getTags } from '@/lib/source'
import { Hero } from './_components/hero'

export default function Page() {
  const tags = getTags()

  return (
    <Wrapper>
      <Hero />
      <Section>
        <div className='flex flex-wrap gap-2 p-4'>
          {tags.map((tag, index) => (
            <ViewAnimation delay={0.03 * index} key={tag}>
              <Link
                className='group inline-flex items-center gap-2 border border-line bg-card/40 px-3 py-1.5 font-mono text-sm transition-[color,border-color,scale] hover:border-primary/40 hover:text-primary active:scale-95'
                data-sound-hover
                href={`/blog/tags/${tag}`}
              >
                <Icons.tag className='size-3.5 text-muted-foreground transition-transform group-hover:-rotate-12 group-hover:text-primary' />
                {tag}
                <span className='text-muted-foreground text-xs'>
                  {getPostsByTag(tag).length}
                </span>
              </Link>
            </ViewAnimation>
          ))}
        </div>
      </Section>
      <CollectionPageJsonLd
        description='Browse blog posts by topic.'
        path='/blog/tags'
        title='Tags'
      />
    </Wrapper>
  )
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>
}): Promise<Metadata> {
  const _params = await props.params
  const description = `Browse blog posts on ${homeTitle} by topic.`

  return createMetadata({
    alternates: {
      canonical: '/blog/tags',
    },
    description,
    openGraph: {
      url: '/blog/tags',
    },
    title: 'Tags',
  })
}
