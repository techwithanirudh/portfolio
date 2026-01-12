import { Section } from '@/components/section'
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
        <ViewAnimation
          className='flex flex-col gap-2 px-6'
          initial={{ opacity: 0, translateY: -8 }}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          <h2 className='max-w-xl text-left font-regular text-3xl tracking-tighter md:text-5xl'>
            Blog
          </h2>
        </ViewAnimation>

        <Carousel className='w-full border-border border-t border-dashed'>
          <CarouselContent className='ml-0 divide-x divide-dashed divide-border'>
            {posts.map((post, index) => {
              const date = new Date(post.data.date).toDateString()
              return (
                <CarouselItem
                  className='min-h-full pl-0 md:basis-1/2 lg:basis-1/3'
                  key={post.url}
                >
                  <ViewAnimation
                    delay={0.6 + 0.1 * index}
                    initial={{ opacity: 0, translateY: -8 }}
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
      </div>
    </Section>
  )
}

export default Updates
