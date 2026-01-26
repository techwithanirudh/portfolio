import { InlineLink } from '@/components/inline-link'
import { SectionHeader } from '@/components/sections/section-header'
import {
  SplitSection,
  SplitSectionContent,
  SplitSectionSidebar,
} from '@/components/sections/split-section'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { ViewAnimation } from '@/components/view-animation'

const faq = [
  {
    question: 'What technologies do you specialize in?',
    answer:
      'I focus on full-stack web development with Next.js, TypeScript, tRPC, Drizzle, and PostgreSQL.',
  },
  {
    question: 'What are you focusing on right now?',
    answer:
      "I'm focused on shipping personal products, polishing this portfolio, and learning more about scalable web app architecture.",
  },
  {
    question: 'How can I get in touch with you?',
    answer:
      'The best way to reach me is through the contact form on this website or via email at hello@techwithanirudh.com. You can also connect with me on GitHub or LinkedIn.',
  },
  {
    question: "What's your development approach?",
    answer:
      "I try to keep things simple, readable, and easy to maintain. I focus on user experience, write clear code, and document what matters. I'm always learning and like shipping small improvements often.",
  },
]

export const FAQ = () => (
  <SplitSection>
    <SplitSectionSidebar>
      <SectionHeader
        align='left'
        description={
          <>
            Still have questions?{' '}
            <InlineLink className='no-underline' href='/contact'>
              Contact Me
            </InlineLink>
          </>
        }
        title='Frequently Asked Questions'
      />
    </SplitSectionSidebar>

    <SplitSectionContent>
      <Accordion
        className='w-full divide-dashed divide-border'
        collapsible
        type='single'
      >
        {faq.map((item, index) => (
          <ViewAnimation
            blur={false}
            delay={0.05 * index}
            duration={0.25}
            initial={{ opacity: 0, translateY: -6 }}
            key={`${item.question}-${index}`}
            whileInView={{ opacity: 1, translateY: 0 }}
          >
            <AccordionItem value={`index-${index}`}>
              <AccordionTrigger className='rounded-none px-4 hover:bg-card hover:no-underline data-[state=open]:bg-card'>
                {item.question}
              </AccordionTrigger>
              <AccordionContent className='p-4'>{item.answer}</AccordionContent>
            </AccordionItem>
          </ViewAnimation>
        ))}
      </Accordion>
    </SplitSectionContent>
  </SplitSection>
)
