import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Fragment } from 'react'
import { Section } from '@/components/layout/sections/section'
import Separator from '@/components/layout/separator'
import { Wrapper } from '@/components/layout/wrapper'
import { AboutPageJsonLd } from '@/components/seo/json-ld'
import { ViewAnimation } from '@/components/shared/view-animation'
import { hardware, software } from '@/constants/portfolio/uses'
import { createMetadata } from '@/lib/metadata'
import { Coding } from './_components/coding'
import { HardwareGrid } from './_components/hardware'
import Hero from './_components/hero'
import { Setup } from './_components/setup'
import { SoftwareGrid } from './_components/software'

const title = 'Uses'
const description =
  'The hardware, software, and tools that power my daily workflow.'

export function generateMetadata(): Metadata {
  return createMetadata({
    alternates: { canonical: '/uses' },
    description,
    openGraph: { url: '/uses' },
    title,
  })
}

export default function UsesPage() {
  const sections: Array<{ title?: string | null; content: ReactNode }> = [
    {
      content: <Setup />,
    },
    {
      content: <HardwareGrid items={hardware} />,
      title: 'Hardware',
    },
    {
      content: <SoftwareGrid items={software} />,
      title: 'Software',
    },
    {
      content: <Coding />,
      title: 'Coding',
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
          <Fragment key={section.title ?? `uses-section-${index}`}>
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
            {index < sections.length - 1 && (
              <Separator variant={index < 1 ? 'dashed' : 'transparent'} />
            )}
          </Fragment>
        )
      })}
      <AboutPageJsonLd description={description} path='/uses' title={title} />
    </Wrapper>
  )
}
