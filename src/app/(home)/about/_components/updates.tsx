import Link from 'next/link'
import { Icons } from '@/components/icons/icons'
import { Section } from '@/components/section'
import { SectionHeader } from '@/components/sections/section-header'
import { buttonVariants } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { ViewAnimation } from '@/components/view-animation'
import type { BlogPage } from '@/lib/source'
import { UpdateCard } from './update-card'

const Updates = ({ posts }: { posts: BlogPage[] }) => {
  return (
    <Section className='relative w-full pt-10'>
      <div className='flex flex-col gap-10'>
        <SectionHeader align='left' className='px-6' title='Blog' />

        <div className='w-full border-border border-t border-dashed'>
          <Carousel className='w-full'>
            <CarouselContent className='ml-0 divide-x divide-dashed divide-border'>
              {posts.map((post, index) => {
                const date = new Date(post.data.date).toDateString()
                return (
                  <CarouselItem
                    className='flex basis-full min-h-full pl-0 md:basis-1/2 lg:basis-1/3'
                    key={post.url}
                  >
                    <ViewAnimation
                      delay={0.05 * index}
                      initial={{ opacity: 0, translateY: -6 }}
                      whileInView={{ opacity: 1, translateY: 0 }}
                    >
                      <UpdateCard
                        author={post.data.author}
                        date={date}
                        description={post.data.description ?? ''}
                        image={post.data.image}
                        slugs={post.slugs}
                        tags={post.data.tags}
                        title={post.data.title}
                        url={post.url}
                      />
                    </ViewAnimation>
                  </CarouselItem>
                )
              })}
            </CarouselContent>
          </Carousel>

          <ViewAnimation
            blur={false}
            delay={0.05 * posts.length}
            initial={{ opacity: 0, translateY: -6 }}
            whileInView={{ opacity: 1, translateY: 0 }}
          >
            <Link
              className={buttonVariants({
                variant: 'default',
                className: 'group w-full rounded-none py-4 sm:py-8',
              })}
              href='/blog'
            >
              View More
              <Icons.arrowRight className='size-5 transition-transform group-hover:-rotate-45' />
            </Link>
          </ViewAnimation>
        </div>
      </div>
    </Section>
  )
}

export default Updates
