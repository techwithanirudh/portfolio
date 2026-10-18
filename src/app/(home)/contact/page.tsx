import type { Metadata } from 'next'
import { ContactPageJsonLd } from '@/components/json-ld'
import {
  SplitSection,
  SplitSectionContent,
  SplitSectionSidebar,
} from '@/components/layout/sections/split'
import { Wrapper } from '@/components/layout/wrapper'
import { ViewAnimation } from '@/components/view-animation'
import { pages } from '@/constants/pages'
import { createMetadata } from '@/lib/metadata'
import { ContactForm } from './_components/contact-form'
import { FAQ } from './_components/faq'
import { Hero } from './_components/hero'

export default function Contact(): React.ReactElement {
  return (
    <Wrapper>
      <SplitSection>
        <SplitSectionSidebar className='px-6 py-14'>
          <ViewAnimation>
            <Hero />
          </ViewAnimation>
        </SplitSectionSidebar>

        <SplitSectionContent className='flex w-full items-center px-6 py-14'>
          <ViewAnimation className='w-full' delay={0.1}>
            <ContactForm />
          </ViewAnimation>
        </SplitSectionContent>
      </SplitSection>
      <FAQ />
      <ContactPageJsonLd
        description={pages.contact.description}
        path={pages.contact.path}
        title={pages.contact.title}
      />
    </Wrapper>
  )
}

export const metadata: Metadata = createMetadata({
  alternates: { canonical: pages.contact.path },
  description: pages.contact.description,
  openGraph: { url: pages.contact.path },
  title: pages.contact.title,
})
