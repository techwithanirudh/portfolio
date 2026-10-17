import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Fragment } from 'react'
import { AboutPageJsonLd } from '@/components/json-ld'
import { Section } from '@/components/layout/sections'
import { HeroSection } from '@/components/layout/sections/hero'
import Separator from '@/components/layout/sections/separator'
import { Wrapper } from '@/components/layout/wrapper'
import { ViewAnimation } from '@/components/view-animation'
import { pages } from '@/constants/pages'
import { hardware, software } from '@/constants/portfolio/uses'
import { createMetadata } from '@/lib/metadata'
import { Coding } from './_components/coding'
import { HardwareGrid } from './_components/hardware'
import { Setup } from './_components/setup'
import { SoftwareGrid } from './_components/software'

const { description, path, title } = pages.uses

export function generateMetadata(): Metadata {
  return createMetadata({
    alternates: { canonical: path },
    description,
    openGraph: { url: path },
    title,
  })
}

export default function UsesPage() {
  const sections: Array<{
    id: string
    title?: string | null
    content: ReactNode
  }> = [
    {
      content: <Setup />,
      id: 'setup',
    },
    {
      content: <HardwareGrid items={hardware} />,
      id: 'hardware',
      title: 'Hardware',
    },
    {
      content: <SoftwareGrid items={software} />,
      id: 'software',
      title: 'Software',
    },
    {
      content: <Coding />,
      id: 'coding',
      title: 'Coding',
    },
  ]

  return (
    <Wrapper>
      <HeroSection description={description} title={title} />
      <Separator />
      {sections.map((section, index) => {
        const baseDelay = 0.1 + index * 0.1
        const headingDelay = section.title ? baseDelay : 0
        const contentDelay = section.title ? headingDelay + 0.05 : 0

        return (
          <Fragment key={section.id}>
            {section.title && (
              <Section className='px-6 py-8'>
                <ViewAnimation delay={headingDelay}>
                  <h2 className='font-medium text-3xl'>{section.title}</h2>
                </ViewAnimation>
              </Section>
            )}
            <Section>
              <ViewAnimation delay={contentDelay}>
                {section.content}
              </ViewAnimation>
            </Section>
            {index < sections.length - 1 && (
              <Separator variant={index < 1 ? 'dashed' : 'transparent'} />
            )}
          </Fragment>
        )
      })}
      <AboutPageJsonLd description={description} path={path} title={title} />
    </Wrapper>
  )
}
