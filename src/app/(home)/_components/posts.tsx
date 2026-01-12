import type { HTMLAttributes } from 'react'
import { PostCard } from '@/components/blog/post-card'
import { Section } from '@/components/section'
import { ViewAnimation } from '@/components/view-animation'
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
            <ViewAnimation
              delay={0.6 + 0.1 * index}
              initial={{ opacity: 0, translateY: -8 }}
              key={post.url}
              whileInView={{ opacity: 1, translateY: 0 }}
            >
              <PostCard
                author={post.data.author}
                date={date}
                description={post.data.description ?? ''}
                image={post.data.image}
                index={index}
                slugs={post.slugs}
                tags={post.data.tags}
                title={post.data.title}
                url={post.url}
              />
            </ViewAnimation>
          )
        })}
      </div>
    </Section>
  )
}
