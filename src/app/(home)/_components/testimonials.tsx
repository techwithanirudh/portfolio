'use client'

import { useEffect, useState } from 'react'
import { Icons } from '@/components/icons/icons'
import { ListSection } from '@/components/layout/sections/list-section'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { ViewAnimation } from '@/components/view-animation'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { staggerDelay } from '@/lib/stagger'
import type { Testimonial } from '@/types'

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
  <ViewAnimation className='h-full' delay={staggerDelay(index, 0.1)}>
    <div className='flex h-full flex-col justify-between gap-28 p-6 transition-colors duration-300 hover:bg-card sm:gap-34 sm:p-8 lg:gap-40'>
      <Icons.user className='icon-tilt size-8 shrink-0' strokeWidth={1} />
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col'>
          <h3 className='text-xl tracking-tight'>{testimonial.title}</h3>
          <p className='text-base text-muted-foreground'>
            {testimonial.description}
          </p>
        </div>
        <p className='flex flex-row items-center gap-2 text-sm'>
          <Avatar className='size-6' outlined={false}>
            <AvatarImage alt='' src={testimonial.author.image} />
            <AvatarFallback>
              {/* TODO(slopradar): duplicate-logic: initials are computed again in uses/_components/logo.tsx and hardware.tsx, add one getInitials helper in src/lib/utils (x3) */}
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
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const paused = hovered || focused

  // TODO(slopradar): library-exists: hand-rolled autoplay plus hovered/focused pause state, use embla-carousel-autoplay (stopOnMouseEnter, stopOnFocusIn) as a Carousel plugin
  useEffect(() => {
    if (!api || prefersReducedMotion || paused) {
      return
    }

    const timer = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext()
      } else {
        api.scrollTo(0)
      }
    }, 2500)

    return () => clearInterval(timer)
  }, [api, paused, prefersReducedMotion])

  return (
    <ListSection
      description="I've worked with some great people. Here's what they say about working with me."
      title='What others are saying'
    >
      <ViewAnimation>
        <Carousel
          className='divider-top-dashed'
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setFocused(false)
            }
          }}
          onFocus={() => setFocused(true)}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          setApi={setApi}
        >
          <CarouselContent className='ml-0 divide-x divide-dashed divide-border'>
            {testimonials.map((item, index) => (
              <CarouselItem
                className='pl-0 md:basis-1/2'
                key={`${item.title}-${item.author.name}`}
              >
                <TestimonialCard index={index} testimonial={item} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </ViewAnimation>
    </ListSection>
  )
}

export default Testimonials
