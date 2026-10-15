import { Section } from '@/components/layout/sections'
import { SectionButton } from '@/components/layout/sections/button'
import { SectionHeader } from '@/components/layout/sections/header'
import { ViewAnimation } from '@/components/view-animation'

const Contact = () => (
  <Section>
    <SectionHeader title='Get in touch' />
    <ViewAnimation
      initial={{ opacity: 0, translateY: -6 }}
      whileInView={{ opacity: 1, translateY: 0 }}
    >
      <div className='flex flex-col gap-4 p-4'>
        <p className='max-w-md text-pretty text-muted-foreground text-sm leading-relaxed'>
          Got a question, an idea, or a weird project? My inbox is open, and the
          dog is always listening.
        </p>
      </div>
    </ViewAnimation>
    <SectionButton href='/contact'>Contact me</SectionButton>
  </Section>
)

export default Contact
