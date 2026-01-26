import type { Metadata } from 'next'
import {
  SplitSection,
  SplitSectionContent,
  SplitSectionSidebar,
} from '@/components/sections/split-section'
import { ViewAnimation } from '@/components/view-animation'
import { Wrapper } from '@/components/wrapper'
import { createMetadata } from '@/lib/metadata'
import { ContactForm } from './_components/contact-form'
import { FAQ } from './_components/faq'
import { Hero } from './_components/hero'

export default function Contact(): React.ReactElement {
  return (
    <Wrapper>
      <SplitSection>
        <SplitSectionSidebar>
          <ViewAnimation
            blur={false}
            initial={{ opacity: 0, translateY: -6 }}
            whileInView={{ opacity: 1, translateY: 0 }}
          >
            <Hero />
          </ViewAnimation>
        </SplitSectionSidebar>

        <SplitSectionContent className='flex w-full items-center px-6 py-8'>
          <ViewAnimation
            blur={false}
            className='w-full'
            delay={0.1}
            initial={{ opacity: 0, translateY: -6 }}
            whileInView={{ opacity: 1, translateY: 0 }}
          >
            <ContactForm />
          </ViewAnimation>
        </SplitSectionContent>
      </SplitSection>
      <FAQ />
    </Wrapper>
  )
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>
}): Promise<Metadata> {
  const _params = await props.params
  const description =
    'Contact me for any inquiries, feedback. We are here to assist you.'

  return createMetadata({
    title: 'Contact',
    description,
    openGraph: {
      url: '/contact',
    },
    alternates: {
      canonical: '/contact',
    },
  })
}
