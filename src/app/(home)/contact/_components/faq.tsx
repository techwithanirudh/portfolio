import { InlineLink } from '@/components/inline-link'
import { Section } from '@/components/section'
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
      'I focus on full-stack web development with Next.js, TypeScript, tRPC, Drizzle, and PostgreSQL. I use AI tools where they add value.',
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
  <Section className='grid divide-y divide-dashed divide-border lg:grid-cols-2 lg:divide-x lg:divide-y-0'>
    <div className='px-6 py-10 md:py-14'>
      <ViewAnimation
        blur={false}
        className='flex flex-col gap-2'
        duration={0.3}
        initial={{ opacity: 0, translateY: -6 }}
        whileInView={{ opacity: 1, translateY: 0 }}
      >
        <div className='flex flex-col gap-2'>
          <h4 className='typography-title text-left font-regular text-3xl tracking-tighter md:text-5xl'>
            Frequently Asked Questions
          </h4>
          <p className='typography-body text-left text-lg text-muted-foreground leading-relaxed tracking-tight'>
            Still have questions?{' '}
            <InlineLink className='no-underline' href='/contact'>
              Contact Me
            </InlineLink>
          </p>
        </div>
      </ViewAnimation>
    </div>

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
  </Section>
)
