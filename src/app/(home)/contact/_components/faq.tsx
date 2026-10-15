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
        description='The usual questions. Anything else, the form above reaches me.'
        title='Frequently Asked Questions'
      />
    </SplitSectionSidebar>

    <SplitSectionContent>
      <Accordion className='w-full'>
        {faq.map((item, index) => (
          <ViewAnimation
            blur={false}
            className='border-line border-b last:border-b-0'
            delay={0.05 * index}
            duration={0.25}
            initial={{ opacity: 0, translateY: -6 }}
            key={item.question}
            whileInView={{ opacity: 1, translateY: 0 }}
          >
            <AccordionItem value={`index-${index}`}>
              <AccordionTrigger className='rounded-none border-0 border-line px-4 transition-colors hover:bg-card/80 hover:no-underline focus-visible:bg-card/80 focus-visible:ring-0 aria-expanded:border-b aria-expanded:bg-card/80'>
                {item.question}
              </AccordionTrigger>
              <AccordionContent className='!h-auto p-4 text-muted-foreground'>
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          </ViewAnimation>
        ))}
      </Accordion>
    </SplitSectionContent>
  </SplitSection>
)
