import { NewsletterForm } from '@/app/(home)/blog/_components/newsletter-form'
import {
  SplitSection,
  SplitSectionContent,
  SplitSectionHeader,
  SplitSectionSidebar,
} from '@/components/layout/sections/split'
import { ViewAnimation } from '@/components/view-animation'

export function NewsletterSection() {
  return (
    <SplitSection>
      <SplitSectionSidebar>
        <SplitSectionHeader
          description='An email when I publish a new post. Unsubscribe anytime.'
          title='Subscribe to the newsletter'
        />
      </SplitSectionSidebar>
      <SplitSectionContent inset>
        <ViewAnimation className='flex size-full items-center' delay={0.15}>
          <NewsletterForm />
        </ViewAnimation>
      </SplitSectionContent>
    </SplitSection>
  )
}
