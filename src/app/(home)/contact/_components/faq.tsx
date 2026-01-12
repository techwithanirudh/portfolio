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
      'I focus on full-stack web development with Next.js, React, TypeScript, and Python. For AI work, I mostly use OpenCV and GPT-based APIs. For databases and backends, I work with Firebase, Drizzle ORM, and Node.js.',
  },
  {
    question: 'What are you focusing on right now?',
    answer:
      "I'm focused on shipping personal products, polishing this portfolio, and learning more about scalable web app architecture.",
  },
  {
    question: 'How can I get in touch with you?',
    answer:
      "The best way to reach me is through the contact form on this website or via email at hello@techwithanirudh.com. You can also connect with me on GitHub, LinkedIn, or join discussions on Anirudh's Arena community forum.",
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
        className='flex flex-col gap-2'
        initial={{ opacity: 0, translateY: -8 }}
        whileInView={{ opacity: 1, translateY: 0 }}
      >
        <div className='flex flex-col gap-2'>
          <h4 className='max-w-xl text-left font-regular text-3xl tracking-tighter md:text-5xl'>
            Frequently Asked Questions
          </h4>
          <p className='max-w-xl text-left text-lg text-muted-foreground leading-relaxed tracking-tight lg:max-w-lg'>
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
          delay={0.6 + index * 0.1}
          initial={{ opacity: 0, translateY: -8 }}
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
