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
import { createMetadata } from '@/lib/metadata'
import { Attribution } from './_components/attribution'
import { Design } from './_components/design'
import { Technology } from './_components/technology'
import { Typography } from './_components/typography'

const { description, path, title } = pages.colophon

export default function ColophonPage() {
  const sections: Array<{ title: string; content: ReactNode }> = [
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
      title: 'Design and colors',
    },
    {
      content: <Attribution />,
      title: 'Attribution',
    },
  ]

  return (
    <Wrapper>
      <HeroSection description={description} title={title} />
      <Separator />
      {sections.map((section, index) => {
        const baseDelay = 0.1 + index * 0.1
        const contentDelay = baseDelay + 0.05

        return (
          <Fragment key={section.title}>
            <Section className='px-6 py-8'>
              <ViewAnimation delay={baseDelay}>
                <h2 className='font-medium text-3xl'>{section.title}</h2>
              </ViewAnimation>
            </Section>
            <Section>
              <ViewAnimation delay={contentDelay}>
                {section.content}
              </ViewAnimation>
            </Section>
            {index < sections.length - 1 && <Separator variant='transparent' />}
          </Fragment>
        )
      })}
      <AboutPageJsonLd description={description} path={path} title={title} />
    </Wrapper>
  )
}

export const metadata: Metadata = createMetadata({
  alternates: { canonical: path },
  description,
  openGraph: { url: path },
  title,
})
