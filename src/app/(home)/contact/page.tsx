import type { Metadata } from 'next'
import { Section } from '@/components/section'
import { ViewAnimation } from '@/components/view-animation'
import { Wrapper } from '@/components/wrapper'
import { createMetadata } from '@/lib/metadata'
import { ContactForm } from './_components/contact-form'
import { FAQ } from './_components/faq'
import { Hero } from './_components/hero'

export default function Contact(): React.ReactElement {
  return (
    <Wrapper>
      <Section className='grid divide-y divide-dashed divide-border lg:grid-cols-2 lg:divide-x lg:divide-y-0'>
        <ViewAnimation
          blur={false}
          className='px-6 py-10'
          initial={{ opacity: 0, translateY: -6 }}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          <Hero />
        </ViewAnimation>

        <ViewAnimation
          blur={false}
          className='flex w-full items-center px-6 py-10'
          delay={0.1}
          initial={{ opacity: 0, translateY: -6 }}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          <ContactForm />
        </ViewAnimation>
      </Section>
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
