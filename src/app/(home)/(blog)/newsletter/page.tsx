import type { Metadata } from 'next';
import type React from 'react';
import { NewsletterForm } from '@/app/(home)/(blog)/newsletter/components/newsletter-form';
import { title as homeTitle } from '@/app/layout.shared';
import { Section } from '@/components/section';
import { ViewAnimation } from '@/components/view-animation';
import { Wrapper } from '@/components/wrapper';
import { createMetadata } from '@/lib/metadata';
import CTA from '../../_components/cta';
import { Hero } from './components/hero';

export default function NewsletterPage(): React.ReactElement {
  return (
    <Wrapper lenis={{}}>
      <Section className='grid divide-y divide-dashed divide-border lg:grid-cols-2 lg:divide-x lg:divide-y-0'>
        <ViewAnimation
          initial={{ opacity: 0, translateY: -8 }}
          whileInView={{ opacity: 1, translateY: 0 }}
          className='px-6 py-10 md:py-14'
        >
          <Hero />
        </ViewAnimation>

        <ViewAnimation
          initial={{ opacity: 0, translateY: -8 }}
          whileInView={{ opacity: 1, translateY: 0 }}
          delay={0.4}
          className='flex w-full items-center px-6 py-10 md:py-14'
        >
          <NewsletterForm />
        </ViewAnimation>
      </Section>
      <CTA />
    </Wrapper>
  );
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const _params = await props.params;
  const description = `News and updates from ${homeTitle}. Stay informed with the latest articles, features, and insights.`;

  return createMetadata({
    title: 'Newsletter',
    description,
    openGraph: {
      url: '/newsletter',
    },
    alternates: {
      canonical: '/newsletter',
    },
  });
}
