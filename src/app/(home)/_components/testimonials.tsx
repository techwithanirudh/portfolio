'use client'

import { useEffect, useReducer, useState } from 'react'
import { TestimonialAuthor } from '@/components/features/testimonial-author'
import { Icons } from '@/components/icons/icons'
import { ListSection } from '@/components/layout/sections/list-section'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { ViewAnimation } from '@/components/view-animation'
import { testimonialsIntro } from '@/constants/portfolio/testimonials'
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
        <TestimonialAuthor author={testimonial.author} />
      </div>
    </div>
  </ViewAnimation>
)

interface Autoplay {
  focused: boolean
  hovered: boolean
  mode: 'auto' | 'paused' | 'resumed'
}

const autoplay = (
  state: Autoplay,
  event: 'toggle' | 'enter' | 'leave' | 'focus' | 'blur'
): Autoplay => {
  switch (event) {
    case 'toggle':
      return { ...state, mode: state.mode === 'paused' ? 'resumed' : 'paused' }
    case 'enter':
      return { ...state, hovered: true }
    case 'focus':
      return { ...state, focused: true }
    case 'leave':
      return {
        ...state,
        hovered: false,
        mode: state.mode === 'resumed' && !state.focused ? 'auto' : state.mode,
      }
    case 'blur':
      return {
        ...state,
        focused: false,
        mode: state.mode === 'resumed' && !state.hovered ? 'auto' : state.mode,
      }
    default:
      return state
  }
}

const Testimonials = ({ testimonials }: TestimonialsProps) => {
  const [api, setApi] = useState<CarouselApi>()
  const [{ mode, hovered, focused }, dispatch] = useReducer(autoplay, {
    focused: false,
    hovered: false,
    mode: 'auto',
  })
  const prefersReducedMotion = useReducedMotion()
  const paused = mode === 'paused'
  const playing =
    !(prefersReducedMotion || paused) &&
    (mode === 'resumed' || !(hovered || focused))

  const scrollBy = (step: number) => {
    if (!api) {
      return
    }
    const count = api.scrollSnapList().length
    api.scrollTo((api.selectedScrollSnap() + step + count) % count)
  }

  useEffect(() => {
    if (!(api && playing)) {
      return
    }

    const timer = setInterval(() => {
      const count = api.scrollSnapList().length
      api.scrollTo((api.selectedScrollSnap() + 1) % count)
    }, 5000)

    return () => clearInterval(timer)
  }, [api, playing])

  return (
    <ListSection
      description={testimonialsIntro.description}
      title={testimonialsIntro.title}
    >
      <ViewAnimation>
        {/* A tab stop so its arrow keys work: the slides hold nothing focusable */}
        <Carousel
          aria-label='Testimonials'
          className='group/testimonials w-full border-t border-dashed'
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              dispatch('blur')
            }
          }}
          onFocus={() => dispatch('focus')}
          onPointerEnter={() => dispatch('enter')}
          onPointerLeave={() => dispatch('leave')}
          setApi={setApi}
          tabIndex={0}
        >
          <div className='absolute top-6 right-6 z-10 flex gap-1 opacity-0 pointer-coarse:opacity-100 transition-opacity duration-150 ease-out-strong group-focus-within/testimonials:opacity-100 group-hover/testimonials:opacity-100 sm:top-8 sm:right-8'>
            {prefersReducedMotion ? null : (
              <Button
                aria-label={paused ? 'Play testimonials' : 'Pause testimonials'}
                className='rounded-full hover:bg-secondary dark:bg-card dark:hover:bg-secondary'
                onClick={() => dispatch('toggle')}
                size='icon-sm'
                variant='outline'
              >
                {paused ? <Icons.play /> : <Icons.pause />}
              </Button>
            )}
            <Button
              aria-label='Previous testimonial'
              className='rounded-full hover:bg-secondary dark:bg-card dark:hover:bg-secondary'
              onClick={() => scrollBy(-1)}
              size='icon-sm'
              variant='outline'
            >
              <Icons.arrowLeft />
            </Button>
            <Button
              aria-label='Next testimonial'
              className='rounded-full hover:bg-secondary dark:bg-card dark:hover:bg-secondary'
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
