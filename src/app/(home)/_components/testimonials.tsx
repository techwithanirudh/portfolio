'use client'

import { User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Section } from '@/components/section'
import { SectionHeader } from '@/components/sections/section-header'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { ViewAnimation } from '@/components/view-animation'

interface Testimonial {
  title: string
  description: string
  author: {
    name: string
    image: string
  }
}

interface TestimonialsProps {
  testimonials: Testimonial[]
}

const TestimonialCard = ({
  testimonial,
  index,
}: {
  testimonial: Testimonial
  index: number
}) => (
  <ViewAnimation
    blur={false}
    className='h-full'
    delay={0.1 + index * 0.05}
    initial={{ opacity: 0, translateX: -12, scale: 0.98 }}
    whileInView={{ opacity: 1, translateX: 0, scale: 1 }}
  >
    <div className='flex min-h-full flex-col justify-between gap-6 p-6 transition-all duration-300 hover:bg-card sm:p-8 lg:aspect-video'>
      <User className='size-8 shrink-0 stroke-1 transition-transform hover:rotate-12 hover:scale-125' />
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col'>
          <h3 className='text-xl tracking-tight'>{testimonial.title}</h3>
          <p className='text-base text-muted-foreground'>
            {testimonial.description}
          </p>
        </div>
        <p className='flex flex-row items-center gap-2 text-sm'>
          <span className='text-muted-foreground'>By</span>
          <Avatar className='h-6 w-6'>
            <AvatarImage
              alt={testimonial.author.name}
              src={testimonial.author.image}
            />
            <AvatarFallback>
              {testimonial.author.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span>{testimonial.author.name}</span>
        </p>
      </div>
    </div>
  </ViewAnimation>
)

const Testimonials = ({ testimonials }: TestimonialsProps) => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    const timer = setTimeout(() => {
      if (api.selectedScrollSnap() + 1 === api.scrollSnapList().length) {
        setCurrent(0)
        api.scrollTo(0)
      } else {
        api.scrollNext()
        setCurrent(current + 1)
      }
    }, 2500)

    return () => clearTimeout(timer)
  }, [api, current])

  return (
    <Section className='relative w-full pt-10'>
      <div className='flex flex-col gap-10'>
        <SectionHeader
          align='left'
          className='px-6'
          description="I've had the pleasure of working with some amazing people. Here is what they have to say about my work."
          title='What others are saying'
        />

        <ViewAnimation
          blur={false}
          initial={{ opacity: 0, translateY: 16 }}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          <Carousel
            className='w-full border-border border-t border-dashed'
            setApi={setApi}
          >
            <CarouselContent className='ml-0 divide-x divide-dashed divide-border'>
              {testimonials.map((item, index) => (
                <CarouselItem
                  className='pl-0 sm:basis-1/2'
                  key={`${item.title}_${index}`}
                >
                  <TestimonialCard index={index} testimonial={item} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </ViewAnimation>
      </div>
    </Section>
  )
}

export default Testimonials
