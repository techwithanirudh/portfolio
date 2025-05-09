import { Section } from '@/components/section';
import { createMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';
import CTA from '../_components/cta';

export default function Socials(): React.ReactElement {
  return (
    <>
      <Section className='p-4 lg:p-6 gap-2 flex flex-col'>
        <h1 className='text-left font-normal text-3xl leading-tight tracking-tighter md:text-5xl'>
          Socials
        </h1>
        <p className='text-left text-lg text-muted-foreground leading-relaxed tracking-tight lg:max-w-lg'>
          Find me on these platforms and let&apos;s connect
        </p>
      </Section>
      
    </>
  );
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const description = 'Find me on these platforms and let\'s connect';

  return createMetadata({
    title: 'Socials',
    description,
    openGraph: {
      url: '/socials',
    },
    alternates: {
      canonical: '/socials',
    },
  });
}
