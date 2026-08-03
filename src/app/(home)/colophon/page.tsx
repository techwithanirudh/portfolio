import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Fragment } from 'react'
import { Section } from '@/components/layout/sections/section'
import Separator from '@/components/layout/separator'
import { Wrapper } from '@/components/layout/wrapper'
import { AboutPageJsonLd } from '@/components/seo/json-ld'
import { ViewAnimation } from '@/components/shared/view-animation'
import { createMetadata } from '@/lib/metadata'
import { Attribution } from './_components/attribution'
import { Design } from './_components/design'
import Hero from './_components/hero'
import { Technology } from './_components/technology'
import { Typography } from './_components/typography'

const title = 'Colophon'
const description =
  'The tools, technologies, and inspirations behind this website.'

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
        const headingDelay = section.title ? baseDelay : 0
        const contentDelay = section.title ? headingDelay + 0.05 : 0

        return (
          <Fragment key={section.title ?? `colophon-section-${index}`}>
            {section.title && (
              <Section className='px-6 py-8'>
                <ViewAnimation
                  delay={headingDelay}
                  initial={{ opacity: 0, translateY: 6 }}
                  whileInView={{ opacity: 1, translateY: 0 }}
                >
                  <h2 className='font-medium text-3xl'>{section.title}</h2>
                </ViewAnimation>
              </Section>
            )}
            <Section>
              <ViewAnimation
                delay={contentDelay}
                initial={{ opacity: 0, translateY: 6 }}
                whileInView={{ opacity: 1, translateY: 0 }}
              >
                {section.content}
              </ViewAnimation>
            </Section>
            {index < sections.length - 1 && <Separator variant='transparent' />}
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
