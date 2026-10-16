import type { Metadata } from 'next'
import { TagCard } from '@/components/features/blog'
import { CollectionPageJsonLd } from '@/components/json-ld'
import { SectionBody } from '@/components/layout/sections/body'
import { Wrapper } from '@/components/layout/wrapper'
import { ViewAnimation } from '@/components/view-animation'
import { title as homeTitle } from '@/constants/site'
import { createMetadata } from '@/lib/metadata'
import { getTags } from '@/lib/source'
import { cn } from '@/lib/utils'
import { Hero } from './_components/hero'

export default function Page() {
  const tags = getTags()
  const smFill = tags.length % 2
  const lgFill = (4 - (tags.length % 4)) % 4
  const fillers = Array.from(
    { length: Math.max(smFill, lgFill) },
    (_, index) => `filler-${index}`
  )

  return (
    <Wrapper>
      <Hero />
      <SectionBody>
        <div className='grid grid-cols-1 divide-y divide-dashed divide-border sm:grid-cols-2 lg:grid-cols-4'>
          {tags.map((tag, index) => (
            <ViewAnimation className='size-full' delay={0.05 * index} key={tag}>
              <TagCard
                className='size-full items-center justify-start gap-2 rounded-none border-r border-dashed bg-card/50 p-6 hover:bg-card/80'
                displayCount
                name={tag}
              />
            </ViewAnimation>
          ))}
          {fillers.map((filler, index) => (
            <ViewAnimation
              className={cn(
                'hidden border-border border-b border-dashed',
                index < smFill && 'sm:block',
                index < lgFill ? 'lg:block' : 'lg:hidden'
              )}
              delay={0.05 * (tags.length + index)}
              key={filler}
            >
              <div className='size-full bg-dashed' />
            </ViewAnimation>
          ))}
        </div>
      </SectionBody>
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
