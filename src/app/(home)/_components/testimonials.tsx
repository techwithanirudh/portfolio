'use client'

import { useEffect, useState } from 'react'
import { Icons } from '@/components/icons/icons'
import { ListSection } from '@/components/layout/sections/list-section'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
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

const AUTOPLAY_INTERVAL_MS = 5000

const Testimonials = ({ testimonials }: TestimonialsProps) => {
  const [api, setApi] = useState<CarouselApi>()
  // `paused` is the visitor's choice and sticks until they press play.
  // Hovering or focusing the carousel pauses it only while they stay, unless
  // they pressed play from inside it (`resumed`), which wins until they leave
  const [paused, setPaused] = useState(false)
  const [resumed, setResumed] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const playing =
    !(prefersReducedMotion || paused) && (resumed || !(hovered || focused))

  const scrollBy = (step: number) => {
    if (!api) {
      return
    }
    const count = api.scrollSnapList().length
    api.scrollTo((api.selectedScrollSnap() + step + count) % count)
  }

  // TODO(slopradar): library-exists: hand-rolled autoplay plus hovered/focused pause state, use embla-carousel-autoplay (stopOnMouseEnter, stopOnFocusIn) as a Carousel plugin
  useEffect(() => {
    if (!(api && playing)) {
      return
    }

    const timer = setInterval(() => {
      const count = api.scrollSnapList().length
      api.scrollTo((api.selectedScrollSnap() + 1) % count)
    }, AUTOPLAY_INTERVAL_MS)

    return () => clearInterval(timer)
  }, [api, playing])

  return (
    <ListSection
      description="I've worked with some great people. Here's what they say about working with me."
      title='What others are saying'
    >
      <ViewAnimation>
        {/* The region is a tab stop so its arrow keys work (the slides hold
            nothing focusable); the controls show on hover or focus within */}
        <Carousel
          aria-label='Testimonials'
          className='group/testimonials divider-top-dashed'
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setFocused(false)
              if (!hovered) {
                setResumed(false)
              }
            }
          }}
          onFocus={() => setFocused(true)}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => {
            setHovered(false)
            if (!focused) {
              setResumed(false)
            }
          }}
          setApi={setApi}
          tabIndex={0}
        >
          <div className='absolute top-6 right-6 z-10 flex gap-1 opacity-0 pointer-coarse:opacity-60 transition-opacity duration-150 ease-out-strong group-focus-within/testimonials:opacity-100 group-hover/testimonials:opacity-100 sm:top-8 sm:right-8'>
            {prefersReducedMotion ? null : (
              <Button
                aria-label={paused ? 'Play testimonials' : 'Pause testimonials'}
                className='rounded-full'
                onClick={() => {
                  setPaused(!paused)
                  setResumed(paused)
                }}
                size='icon-sm'
                variant='outline'
              >
                {paused ? <Icons.play /> : <Icons.pause />}
              </Button>
            )}
            <Button
              aria-label='Previous testimonial'
              className='rounded-full'
              onClick={() => scrollBy(-1)}
              size='icon-sm'
              variant='outline'
            >
              <Icons.arrowLeft />
            </Button>
            <Button
              aria-label='Next testimonial'
              className='rounded-full'
              onClick={() => scrollBy(1)}
              size='icon-sm'
              variant='outline'
            >
              <Icons.arrowRight />
            </Button>
          </div>
          <CarouselContent className='ml-0 divide-x divide-dashed divide-border'>
            {testimonials.map((item, index) => (
              <CarouselItem
                aria-label={`${index + 1} of ${testimonials.length}`}
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
