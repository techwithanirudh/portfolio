import { socials } from '@/app/layout.config';
import { Section } from '@/components/section';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Wrapper } from '@/components/wrapper';
import { createMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';
import { ContactForm } from './_components/contact-form';
import { FAQ } from './_components/faq';

export default function Contact(): React.ReactElement {
  return (
    <Wrapper lenis={{}}>
      <Section className='grid divide-y divide-dashed divide-border lg:grid-cols-2 lg:divide-x lg:divide-y-0'>
        <div className='flex flex-col gap-2 px-6 py-10 md:py-14'>
          <h4 className='max-w-xl text-left font-regular text-3xl tracking-tighter md:text-5xl'>
            Contact Me
          </h4>
          <p className='max-w-xl text-left text-lg text-muted-foreground leading-relaxed tracking-tight lg:max-w-lg'>
            Have a question or want to connect? Send a message and expect a
            response within a week.
          </p>
          <TooltipProvider>
            <div className='mt-4 flex w-min flex-row gap-4 rounded-full bg-muted p-1.5 text-muted-foreground'>
              {socials.map((social) => (
                <Tooltip key={social.url} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <a
                      key={social.name}
                      href={social.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center justify-center rounded-full p-2 text-muted-foreground transition-colors transition-transform hover:scale-125 hover:bg-accent hover:text-accent-foreground [&_svg]:size-5'
                    >
                      {social.icon}
                    </a>
                  </TooltipTrigger>
                  <TooltipContent align='center' side='bottom'>
                    <p className='text-sm'>{social.name}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        </div>

        <div className='flex w-full items-center px-6 py-10 md:py-14'>
          <ContactForm />
        </div>
      </Section>
      <FAQ />
    </Wrapper>
  );
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const description =
    'Contact me for any inquiries, feedback. We are here to assist you.';

  return createMetadata({
    title: 'Contact',
    description,
    openGraph: {
      url: '/contact',
    },
    alternates: {
      canonical: '/contact',
    },
  });
}
