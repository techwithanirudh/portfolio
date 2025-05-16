import { Icons } from '@/components/icons/icons';
import { Section } from '@/components/section';
import { buttonVariants } from '@/components/ui/button';
import { ViewAnimation } from '@/components/view-animation';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function About(): React.ReactElement {
  return (
    <Section className='grid divide-y divide-dashed divide-border lg:grid-cols-2 lg:divide-x lg:divide-y-0'>
      <ViewAnimation
        className='flex flex-col gap-2 px-6 py-10 md:py-14 h-full'
        initial={{ opacity: 0, translateY: -8 }}
        whileInView={{ opacity: 1, translateY: 0 }}
      >
        <h4 className='text-left font-regular text-3xl tracking-tighter md:text-5xl'>
          About Me
        </h4>
      </ViewAnimation>

      <ViewAnimation
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        delay={0.4}
        className='relative'
      >
        <div className='space-y-4 px-6 py-10 md:py-14'>
          <div className='prose dark:prose-invert w-full space-y-4'>
            <p className='text-lg'>
              I’m a moderator on Anirudh’s Arena forum and an active member of
              the AMC (Active Member Chat) community. I’m passionate about
              building vibrant online communities.
            </p>
            <p className='text-lg'>
              I’m also a content creator, sharing my love for chess and
              entertainment on various platforms. I enjoy creating engaging
              content that resonates with my audience.
            </p>
          </div>
          <Link
            className={cn(
              buttonVariants({
                variant: 'link',
                size: 'lg',
              }),
              'group !p-0 h-fit',
            )}
            href='/about'
          >
            Learn More
            <Icons.arrowUpRight className='group-hover:-rotate-12 size-5 transition-transform' />
          </Link>
        </div>
      </ViewAnimation>
    </Section>
  );
}
