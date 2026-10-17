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

interface Testimonial {
  author: {
    name: string
    image: string
  }
  description: string
  title: string
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
  <ViewAnimation className='h-full' delay={0.1 + index * 0.05}>
    {/* Quotes hang from the top so titles line up across cards, with the
        author pinned to the bottom whatever the quote's length */}
    <div className='flex h-full flex-col gap-4 p-6 transition-colors duration-300 hover:bg-card sm:p-8'>
      <Icons.user
        className='icon-tilt mb-20 size-8 shrink-0 sm:mb-26 lg:mb-32'
        strokeWidth={1}
      />
      <div className='flex flex-1 flex-col gap-4'>
        <div className='flex flex-col'>
          <h3 className='text-xl tracking-tight'>{testimonial.title}</h3>
          <p className='text-base text-muted-foreground'>
            {testimonial.description}
          </p>
        </div>
        <p className='mt-auto flex flex-row items-center gap-2 text-sm'>
          <Avatar className='size-6' outlined={false}>
            <AvatarImage alt='' src={testimonial.author.image} />
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
  const [snaps, setSnaps] = useState(0)
  const [selected, setSelected] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const paused = hovered || focused

  useEffect(() => {
    if (!api) {
      return
    }
    const sync = () => {
      setSnaps(api.scrollSnapList().length)
      setSelected(api.selectedScrollSnap())
    }
    sync()
    api.on('select', sync).on('reInit', sync)
    return () => {
      api.off('select', sync).off('reInit', sync)
    }
  }, [api])

  // Nothing to rotate when every card already fits
  useEffect(() => {
    if (!api || prefersReducedMotion || paused || snaps < 2) {
      return
    }

    const timer = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext()
      } else {
        api.scrollTo(0)
      }
    }, 6000)

    return () => clearInterval(timer)
  }, [api, paused, prefersReducedMotion, snaps])

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
          {snaps > 1 && (
            <div className='flex justify-center border-border border-t border-dashed py-1.5'>
              {Array.from({ length: snaps }, (_, snap) => snap).map((snap) => (
                <button
                  aria-current={snap === selected || undefined}
                  aria-label={`Go to testimonial ${snap + 1}`}
                  className='group p-1.5'
                  key={snap}
                  onClick={() => api?.scrollTo(snap)}
                  type='button'
                >
                  <span className='block h-1.5 w-1.5 rounded-full bg-muted-foreground/30 transition-[width,background-color] duration-300 group-hover:bg-muted-foreground/60 group-aria-current:w-4 group-aria-current:bg-primary' />
                </button>
              ))}
            </div>
          )}
        </Carousel>
      </ViewAnimation>
    </ListSection>
  )
}

export default Testimonials
