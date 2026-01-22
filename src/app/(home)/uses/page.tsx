import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Fragment } from 'react'
import { Section } from '@/components/section'
import { ViewAnimation } from '@/components/view-animation'
import { Wrapper } from '@/components/wrapper'
import { hardware, software } from '@/constants/portfolio/uses'
import { createMetadata } from '@/lib/metadata'
import { Coding } from './_components/coding'
import { Setup } from './_components/setup'
import { HardwareGrid } from './_components/hardware'
import Hero from './_components/hero'
import { SoftwareGrid } from './_components/software'

const title = 'Uses'
const description =
  'The hardware, software, and tools that power my daily workflow.'

export function generateMetadata(): Metadata {
  return createMetadata({
    title,
    description,
    openGraph: { url: '/uses' },
    alternates: { canonical: '/uses' },
  })
}

export default function UsesPage() {
  const sections: Array<{ title?: string | null; content: ReactNode }> = [
    {
      content: <Setup />,
    },
    {
      title: 'Hardware',
      content: <HardwareGrid items={hardware} />,
    },
    {
      title: 'Software',
      content: <SoftwareGrid items={software} />,
    },
    {
      title: 'Coding',
      content: <Coding />,
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
          <Fragment key={section.title ?? `uses-section-${index}`}>
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
