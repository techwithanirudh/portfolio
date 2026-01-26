import { NewsletterForm } from '@/app/(home)/blog/_components/newsletter-form'
import {
  SplitSection,
  SplitSectionContent,
  SplitSectionHeader,
  SplitSectionSidebar,
} from '@/components/sections/split-section'
import { ViewAnimation } from '@/components/view-animation'

export function NewsletterSection() {
  return (
    <SplitSection>
      <SplitSectionSidebar>
        <SplitSectionHeader
          description='Get notified when I publish new posts. No spam, unsubscribe anytime.'
          title='Subscribe to the newsletter'
        />
      </SplitSectionSidebar>
      <SplitSectionContent inset>
        <ViewAnimation
          className='flex size-full items-center'
          delay={0.15}
          initial={{ opacity: 0, translateY: -6 }}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          <NewsletterForm />
        </ViewAnimation>
      </SplitSectionContent>
    </SplitSection>
  )
}
