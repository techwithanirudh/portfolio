import { SectionHeader } from '@/components/layout/sections/header'
import {
  SplitSection,
  SplitSectionContent,
  SplitSectionSidebar,
} from '@/components/layout/sections/split'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { ViewAnimation } from '@/components/view-animation'
import { AskSimbaLink } from './ask-simba-link'

const faq = [
  {
    answer:
      'I focus on full-stack web development with Next.js, TypeScript, tRPC, Drizzle, and PostgreSQL.',
    question: 'What technologies do you specialize in?',
  },
  {
    answer:
      "I'm focused on shipping personal products, polishing this portfolio, and learning more about scalable web app architecture.",
    question: 'What are you focusing on right now?',
  },
  {
    answer:
      'Use the contact form on this website or email me at hello@techwithanirudh.com. You can also connect with me on GitHub or LinkedIn.',
    question: 'How can I get in touch with you?',
  },
  {
    answer:
      'I keep code simple and easy to maintain. I care about the user experience, write clear code, and document the parts that need it. I like shipping small improvements often.',
    question: "What's your development approach?",
  },
]

export const FAQ = () => (
  <SplitSection>
    <SplitSectionSidebar>
      <SectionHeader
        align='left'
        description={
          <>
            Still curious? <AskSimbaLink />, he's read everything on this site.
          </>
        }
        title='Frequently Asked Questions'
      />
    </SplitSectionSidebar>

    <SplitSectionContent>
      <Accordion className='w-full [&>[data-slot=accordion-item]:last-child]:border-b-0 [&>[data-slot=accordion-item]]:border-border [&>[data-slot=accordion-item]]:border-b [&>[data-slot=accordion-item]]:border-dashed'>
        {faq.map((item, index) => (
          <ViewAnimation
            className='border-border border-b border-dashed last:border-b-0'
            delay={0.05 * index}
            key={item.question}
          >
            <AccordionItem value={`index-${index}`}>
              <AccordionTrigger className='rounded-none px-4 hover:bg-card hover:no-underline data-open:bg-card'>
                {item.question}
              </AccordionTrigger>
              <AccordionContent className='!h-auto p-4'>
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          </ViewAnimation>
        ))}
      </Accordion>
    </SplitSectionContent>
  </SplitSection>
)
