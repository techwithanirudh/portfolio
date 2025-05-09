import { Icons } from '@/components/icons/icons';
import { Section } from '@/components/section';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function About(): React.ReactElement {
  return (
    <Section className='grid divide-y divide-dashed divide-border lg:grid-cols-2 lg:divide-x lg:divide-y-0'>
      <div className='flex flex-col gap-2 px-6 py-10 md:py-14'>
        <h4 className='text-left font-regular text-3xl tracking-tighter md:text-5xl'>
          About Me
        </h4>
        
      </div>

      <div className='space-y-4 px-6 py-10 md:py-14'>
        <div className='prose dark:prose-invert w-full space-y-4'>
          <p className='text-lg'>
            I’m a moderator on Anirudh’s Arena forum and an active member of the AMC (Active Member Chat) community. I’m passionate about building vibrant online communities.
          </p>
        </div>
        <Link
          className={cn(
            buttonVariants({
              variant: 'link',
              size: 'lg',
            }),
            'group !p-0',
          )}
          href='/about'
        >
          Learn More
          <Icons.arrowUpRight className='group-hover:-rotate-12 size-5 transition-transform' />
        </Link>
      </div>
    </Section>
  );
}
