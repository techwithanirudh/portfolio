import { InlineLink } from '@/components/inline-link';
import { Section } from '@/components/section';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faq = [
  {
    question: "What's the best way to contact you?",
    answer:
      'The most reliable way to reach me is through the contact form on this website. I check my emails regularly and will respond as soon as possible.',
  },
  {
    question: 'Can I challenge you to a chess game?',
    answer:
      'You can find me on Chess.com and send a challenge. I enjoy playing with community members when time permits.',
  },
  {
    question: 'Where can I chat with you?',
    answer:
      'You can chat with me on AMCForum and Anirudh’s Arena! Feel free to drop by and say hi!',
  },
  {
    question: 'How often do you post on YouTube?',
    answer:
      'I’m currently juggling school, so my upload schedule isn’t super consistent, but I aim to post 1-2 videos a month. Subscribe to stay updated whenever new content drops!',
  },
];

export const FAQ = () => (
  <Section className='grid divide-y divide-dashed divide-border lg:grid-cols-2 lg:divide-x lg:divide-y-0'>
    <div className='flex flex-col gap-2 px-6 py-10 md:py-14'>
      <h4 className='max-w-xl text-left font-regular text-3xl tracking-tighter md:text-5xl'>
        Frequently Asked Questions
      </h4>
      <p className='max-w-xl text-left text-lg text-muted-foreground leading-relaxed tracking-tight lg:max-w-lg'>
        Still have questions?{' '}
        <InlineLink href='/contact' className='no-underline'>
          Contact Me
        </InlineLink>
      </p>
    </div>

    <Accordion
      type='single'
      collapsible
      className='w-full divide-dashed divide-border'
    >
      {faq.map((item, index) => (
        <AccordionItem
          key={`${item.question}-${index}`}
          value={`index-${index}`}
        >
          <AccordionTrigger className='rounded-none px-4 hover:bg-card hover:no-underline data-[state=open]:bg-card'>
            {item.question}
          </AccordionTrigger>
          <AccordionContent className='p-4'>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </Section>
);
