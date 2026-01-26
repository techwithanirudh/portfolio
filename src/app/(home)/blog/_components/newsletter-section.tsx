import { NewsletterForm } from '@/app/(home)/blog/_components/newsletter-form'
import { Section } from '@/components/section'
import { ViewAnimation } from '@/components/view-animation'

export function NewsletterSection() {
  return (
    <Section className='bg-dashed'>
      <div className='grid gap-6 px-6 py-10 md:grid-cols-2 md:items-center md:gap-10 md:py-14'>
        <div className='space-y-2'>
          <ViewAnimation
            duration={0.3}
            initial={{ opacity: 0, translateY: -6 }}
            whileInView={{ opacity: 1, translateY: 0 }}
          >
            <h3 className='font-semibold text-lg'>
              Subscribe to the newsletter
            </h3>
          </ViewAnimation>
          <ViewAnimation
            delay={0.1}
            duration={0.3}
            initial={{ opacity: 0, translateY: -6 }}
            whileInView={{ opacity: 1, translateY: 0 }}
          >
            <p className='text-muted-foreground text-sm'>
              Get notified when I publish new posts. No spam, unsubscribe
              anytime.
            </p>
          </ViewAnimation>
        </div>
        <ViewAnimation
          delay={0.15}
          duration={0.3}
          initial={{ opacity: 0, translateY: -6 }}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          <NewsletterForm />
        </ViewAnimation>
      </div>
    </Section>
  )
}
