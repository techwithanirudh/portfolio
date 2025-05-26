import { title as homeTitle } from '@/app/layout.config';
import { Section } from '@/components/section';
import { TagCard } from '@/components/tags/tag-card';
import { Wrapper } from '@/components/wrapper';
import { createMetadata } from '@/lib/metadata';
import { getTags } from '@/lib/source';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Hero } from './_components/hero';
import { ViewAnimation } from '@/components/view-animation';

export default function Page() {
  const tags = getTags();

  return (
    <Wrapper lenis={{}}>
      <Hero />
      <Section className='h-full' sectionClassName='flex flex-1'>
        <div className='grid grid-cols-1 divide-y divide-dashed divide-border sm:grid-cols-2 lg:grid-cols-4'>
          {tags.map((tag, index) => (
            <ViewAnimation
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              delay={(index % 4) * 0.2}
              className='size-full'
              key={tag}
            >
              <TagCard
                displayCount={true}
                name={tag}
                className={cn(
                  'items-center justify-start gap-2 rounded-none border-r bg-card/50 p-6 hover:bg-card/80 size-full'
                )}
              />
            </ViewAnimation>
          ))}
          {tags.length % 2 === 1 && (
            <div className='size-full border-border border-dashed bg-dashed sm:border-b sm:border-l' />
          )}
        </div>
      </Section>
    </Wrapper>
  );
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const description = `Explore all the tags on ${homeTitle}.`;

  return createMetadata({
    title: 'Tags',
    description,
    openGraph: {
      url: '/tags',
    },
    alternates: {
      canonical: '/tags',
    },
  });
}
