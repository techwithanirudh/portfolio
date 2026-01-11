import Link from 'next/link'
import type { HTMLAttributes } from 'react'
import { PostCard } from '@/components/blog/post-card'
import { Icons } from '@/components/icons/icons'
import { Section } from '@/components/section'
import { buttonVariants } from '@/components/ui/button'
import type { BlogPage } from '@/lib/source'

export default function Posts({
  posts,
  ...props
}: { posts: BlogPage[] } & {
  sectionClassName?: string
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <Section {...props}>
      <div className='grid divide-y divide-dashed divide-border text-left'>
        {posts.map((post, index) => {
          const date = new Date(post.data.date).toDateString()
          return (
            <PostCard
              author={post.data.author}
              date={date}
              description={post.data.description ?? ''}
              image={post.data.image}
              index={index}
              key={post.url}
              slugs={post.slugs}
              tags={post.data.tags}
              title={post.data.title}
              url={post.url}
            />
          )
        })}
        <Link
          className={buttonVariants({
            variant: 'default',
            className: 'group rounded-none py-4 sm:py-8',
          })}
          href='/blog'
        >
          View More
          <Icons.arrowUpRight className='ml-2 size-5 transition-transform group-hover:-rotate-12' />
        </Link>
      </div>
    </Section>
  )
}
