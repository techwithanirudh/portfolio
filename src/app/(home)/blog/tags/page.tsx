import type { Metadata } from 'next'
import { TagCard } from '@/components/features/blog'
import { CollectionPageJsonLd } from '@/components/json-ld'
import { SectionBody } from '@/components/layout/sections/body'
import { HeroSection } from '@/components/layout/sections/hero'
import { Wrapper } from '@/components/layout/wrapper'
import { ViewAnimation } from '@/components/view-animation'
import { pages } from '@/constants/pages'
import { createMetadata } from '@/lib/metadata'
import { getTags } from '@/lib/source'
import { cn } from '@/lib/utils'

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
      <HeroSection title={pages.blogTags.title} />
      <SectionBody>
        <div className='dashed-stack grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
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
        description={pages.blogTags.description}
        path={pages.blogTags.path}
        title={pages.blogTags.title}
      />
    </Wrapper>
  )
}

export const metadata: Metadata = createMetadata({
  alternates: { canonical: pages.blogTags.path },
  description: pages.blogTags.description,
  openGraph: { url: pages.blogTags.path },
  title: pages.blogTags.title,
})
