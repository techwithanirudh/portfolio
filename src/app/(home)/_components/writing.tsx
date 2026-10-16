import { PostCard } from '@/components/features/blog'
import { Section } from '@/components/layout/sections'
import { SectionHeader } from '@/components/layout/sections/header'
import { SectionMoreLink } from '@/components/layout/sections/more-link'
import { ViewAnimation } from '@/components/view-animation'
import type { BlogPage } from '@/lib/source'

export default function Writing({ posts }: { posts: BlogPage[] }) {
  return (
    <Section className='relative w-full pt-10'>
      <div className='flex flex-col gap-10'>
        <SectionHeader
          align='left'
          className='px-6'
          description='Notes on things I build and learn.'
          title='Writing'
        />

        <div>
          <div className='grid divide-y divide-dashed divide-border border-border border-t border-dashed text-left'>
            {posts.map((post, index) => (
              <ViewAnimation delay={0.05 * index} key={post.url}>
                <PostCard
                  author={post.data.author}
                  date={new Date(post.data.date).toDateString()}
                  description={post.data.description ?? ''}
                  title={post.data.title}
                  url={post.url}
                />
              </ViewAnimation>
            ))}
          </div>
          <SectionMoreLink delay={0.05 * posts.length} href='/blog'>
            View all posts
          </SectionMoreLink>
        </div>
      </div>
    </Section>
  )
}
