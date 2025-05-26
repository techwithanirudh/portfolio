import { PostCard } from '@/components/blog/post-card';
import { Icons } from '@/components/icons/icons';
import { Section } from '@/components/section';
import { buttonVariants } from '@/components/ui/button';
import type { Page } from '@/lib/source';
import Link from 'next/link';
import type { HTMLAttributes } from 'react';

export default function Posts({
  posts,
  ...props
}: { posts: Page[] } & {
  sectionClassName?: string;
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <Section {...props}>
      <div className='grid divide-y divide-dashed divide-border text-left'>
        {posts.map((post) => {
          const date = new Date(post.data.date).toDateString();
          return (
            <PostCard
              title={post.data.title}
              description={post.data.description ?? ''}
              image={post.data.image}
              url={post.url}
              date={date}
              key={post.url}
              author={post.data.author}
              tags={post.data.tags}
              slugs={post.slugs}
            />
          );
        })}
        <Link
          href='/blog'
          className={buttonVariants({
            variant: 'default',
            className: 'group rounded-none py-4 sm:py-8',
          })}
        >
          View More
          <Icons.arrowUpRight className='group-hover:-rotate-12 ml-2 size-5 transition-transform' />
        </Link>
      </div>
    </Section>
  );
}
