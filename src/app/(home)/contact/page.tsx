import type { Metadata } from 'next'
import { ContactPageJsonLd } from '@/components/json-ld'
import { SectionHeader } from '@/components/layout/sections/header'
import {
  SplitSection,
  SplitSectionContent,
  SplitSectionSidebar,
} from '@/components/layout/sections/split'
import { Wrapper } from '@/components/layout/wrapper'
import { ViewAnimation } from '@/components/view-animation'
import { createMetadata } from '@/lib/metadata'
import { ContactForm } from './_components/contact-form'
import { FAQ } from './_components/faq'
import { Hero } from './_components/hero'

export default function Contact(): React.ReactElement {
  return (
    <Wrapper>
      <Hero />
      <SplitSection>
        <SplitSectionSidebar>
          <SectionHeader
            align='left'
            description={
              <>
                Or email{' '}
                <a
                  className='link-underline'
                  href='mailto:hello@techwithanirudh.com'
                >
                  hello@techwithanirudh.com
                </a>
                .
              </>
            }
            sticky
            title='Message'
          />
        </SplitSectionSidebar>

        <SplitSectionContent className='px-6 py-8'>
          <ViewAnimation delay={0.1}>
            <ContactForm />
          </ViewAnimation>
        </SplitSectionContent>
      </SplitSection>
      <FAQ />
      <ContactPageJsonLd
        description='Contact me with questions or feedback.'
        path='/contact'
        title='Contact'
      />
    </Wrapper>
  )
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>
}): Promise<Metadata> {
  const _params = await props.params
  const description = 'Contact me with questions or feedback.'

  return createMetadata({
    alternates: {
      canonical: '/contact',
    },
    description,
    openGraph: {
      url: '/contact',
    },
    title: 'Contact',
  })
}
