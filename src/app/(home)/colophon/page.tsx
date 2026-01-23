import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Fragment } from 'react'
import { Section } from '@/components/section'
import { ViewAnimation } from '@/components/view-animation'
import { Wrapper } from '@/components/wrapper'
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
      title: 'Technology',
      content: <Technology />,
    },
    {
      title: 'Typography',
      content: <Typography />,
    },
    {
      title: 'Design & Colors',
      content: <Design />,
    },
    {
      title: 'Attribution',
      content: <Attribution />,
    },
  ]

  return (
    <Wrapper>
      <Hero description={description} title={title} />
      {sections.map((section, index) => {
        const baseDelay = 0.1 + index * 0.1
        const headingDelay = section.title ? baseDelay : 0
        const contentDelay = section.title ? headingDelay + 0.05 : 0

        return (
          <Fragment key={section.title ?? `colophon-section-${index}`}>
            {section.title && (
              <Section className='p-6'>
                <ViewAnimation
                  delay={headingDelay}
                  initial={{ opacity: 0, translateY: 6 }}
                  whileInView={{ opacity: 1, translateY: 0 }}
                >
                  <h2 className='font-medium text-xl'>{section.title}</h2>
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
          </Fragment>
        )
      })}
    </Wrapper>
  )
}

export function generateMetadata(): Metadata {
  return createMetadata({
    title,
    description,
    openGraph: { url: '/colophon' },
    alternates: { canonical: '/colophon' },
  })
}
