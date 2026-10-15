import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Fragment } from 'react'
import { AboutPageJsonLd } from '@/components/json-ld'
import { Section } from '@/components/layout/sections'
import {
  SectionHeader,
  SectionTitleSup,
} from '@/components/layout/sections/header'
import Separator from '@/components/layout/sections/separator'
import { Wrapper } from '@/components/layout/wrapper'
import { ViewAnimation } from '@/components/view-animation'
import { attributions, technology } from '@/constants/portfolio/colophon'
import { createMetadata } from '@/lib/metadata'
import { Attribution } from './_components/attribution'
import { Design } from './_components/design'
import { Facts } from './_components/facts'
import Hero from './_components/hero'
import { Technology } from './_components/technology'
import { Typography } from './_components/typography'

const title = 'Colophon'
const description =
  'How this site is built, what it is set in, and who I borrowed from.'

interface ColophonSection {
  content: ReactNode
  description?: string
  id: string
  title?: ReactNode
}

export default function ColophonPage() {
  const sections: ColophonSection[] = [
    { content: <Facts />, id: 'facts' },
    {
      content: <Technology />,
      description: 'The stack, grouped by what it does here.',
      id: 'technology',
      title: (
        <>
          Technology<SectionTitleSup>({technology.length})</SectionTitleSup>
        </>
      ),
    },
    {
      content: <Typography />,
      description:
        'Set entirely in Geist, the sans for reading and the mono for everything else.',
      id: 'typography',
      title: 'Typography',
    },
    {
      content: <Design />,
      description: 'A handful of rules the whole site sticks to.',
      id: 'design',
      title: 'Design',
    },
    {
      content: <Attribution />,
      description: 'People and projects this site owes a lot to.',
      id: 'attribution',
      title: (
        <>
          Attribution
          <SectionTitleSup>({attributions.length})</SectionTitleSup>
        </>
      ),
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
          <Fragment key={section.id}>
            <Section id={section.id}>
              {section.title && (
                <SectionHeader
                  description={section.description}
                  title={section.title}
                />
              )}
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
