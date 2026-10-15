import Link from 'next/link'
import { Icons } from '@/components/icons/icons'
import { Section } from '@/components/layout/sections'
import { SectionHeader } from '@/components/layout/sections/header'
import { buttonVariants } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { ViewAnimation } from '@/components/view-animation'
import type { BlogPage } from '@/lib/source'
import { UpdateCard } from './update-card'

const Updates = ({ posts }: { posts: BlogPage[] }) => (
  <Section className='relative w-full pt-10'>
    <div className='flex flex-col gap-10'>
      <SectionHeader align='left' className='px-6' title='Blog' />

      <div className='divider-top-dashed'>
        <Carousel className='w-full'>
          <CarouselContent className='ml-0 divide-x divide-dashed divide-border'>
            {posts.map((post, index) => {
              const date = new Date(post.data.date).toDateString()
              return (
                <CarouselItem
                  className='flex min-h-full basis-full pl-0 md:basis-1/2 lg:basis-1/3'
                  key={post.url}
                >
                  <ViewAnimation delay={0.05 * index}>
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

        <ViewAnimation delay={0.05 * posts.length}>
          <Link
            className={buttonVariants({
              className: 'w-full py-8 active:scale-none active:opacity-80',
              shape: 'square',
              variant: 'default',
            })}
            href='/blog'
          >
            View More
            <Icons.arrowRight className='icon-arrow-button size-5' />
          </Link>
        </ViewAnimation>
      </div>
    </div>
  </Section>
)

export default Updates
