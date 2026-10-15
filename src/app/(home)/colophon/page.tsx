import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Fragment } from 'react'
import { AboutPageJsonLd } from '@/components/json-ld'
import { Section } from '@/components/layout/sections'
import { SectionHeader } from '@/components/layout/sections/header'
import Separator from '@/components/layout/sections/separator'
import { Wrapper } from '@/components/layout/wrapper'
import { ViewAnimation } from '@/components/view-animation'
import { createMetadata } from '@/lib/metadata'
import { Attribution } from './_components/attribution'
import { Design } from './_components/design'
import Hero from './_components/hero'
import { Technology } from './_components/technology'
import { Typography } from './_components/typography'

const title = 'Colophon'
const description = 'The tools, fonts, and people behind this website.'

export default function ColophonPage() {
  const sections: Array<{ title?: string | null; content: ReactNode }> = [
    {
      content: <Technology />,
      title: 'Technology',
    },
    {
      content: <Typography />,
      title: 'Typography',
    },
    {
      content: <Design />,
      title: 'Design & Colors',
    },
    {
      content: <Attribution />,
      title: 'Attribution',
    },
  ]

  return (
    <Wrapper>
      <Hero description={description} title={title} />
      <Separator />
      {sections.map((section, index) => {
        const baseDelay = 0.1 + index * 0.1
        const contentDelay = section.title ? baseDelay + 0.05 : 0

        return (
          <Fragment key={section.title ?? `colophon-section-${index}`}>
            <Section>
              {section.title && <SectionHeader title={section.title} />}
              <ViewAnimation delay={contentDelay}>
                {section.content}
              </ViewAnimation>
            </Section>
            {index < sections.length - 1 && <Separator />}
          </Fragment>
        )
      })}
      <AboutPageJsonLd
        description={description}
        path='/colophon'
        title={title}
      />
    </Wrapper>
  )
}

export function generateMetadata(): Metadata {
  return createMetadata({
    alternates: { canonical: '/colophon' },
    description,
    openGraph: { url: '/colophon' },
    title,
  })
}
