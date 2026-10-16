'use client'

import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import { useEffect, useRef, useState } from 'react'
import { Icons } from '@/components/icons/icons'
import { Section } from '@/components/layout/sections'
import { SectionHeader } from '@/components/layout/sections/header'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { prefersReducedMotion } from '@/lib/reduced-motion'
import type { Testimonial } from '@/types'

const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  const quoteRef = useRef<HTMLQuoteElement>(null)
  const [clamped, setClamped] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const quote = quoteRef.current
    if (!quote) {
      return
    }
    const measure = () => {
      if (!open) {
        setClamped(quote.scrollHeight > quote.clientHeight + 1)
      }
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(quote)
    return () => observer.disconnect()
  }, [open])

  return (
    <figure className='group flex h-full flex-col justify-between gap-8 p-4 transition-colors hover:bg-card'>
      <div className='flex flex-col gap-2'>
        <h3 className='font-medium text-foreground'>{testimonial.title}</h3>
        <blockquote
          className={
            open
              ? 'text-pretty text-muted-foreground text-sm leading-relaxed'
              : 'line-clamp-4 text-pretty text-muted-foreground text-sm leading-relaxed'
          }
          ref={quoteRef}
        >
          &ldquo;{testimonial.description}&rdquo;
        </blockquote>
        {(clamped || open) && (
          <button
            aria-expanded={open}
            className='self-start font-mono text-primary text-xs underline-offset-4 hover:underline'
            onClick={() => setOpen((value) => !value)}
            type='button'
          >
            {open ? 'less' : 'more'}
          </button>
        )}
      </div>
      <figcaption className='flex items-center gap-2 font-mono text-muted-foreground text-xs'>
        <Avatar
          className='size-5 rounded-full transition-transform duration-300 *:rounded-full group-hover:rotate-12 group-hover:scale-125'
          outlined={false}
        >
          <AvatarImage alt='' src={testimonial.author.image} />
          <AvatarFallback>{initials(testimonial.author.name)}</AvatarFallback>
        </Avatar>
        {testimonial.author.name}
      </figcaption>
    </figure>
  )
}

const Testimonials = ({ testimonials }: { testimonials: Testimonial[] }) => {
  const [autoplay] = useState(() =>
    Autoplay({
      delay: 6000,
      stopOnFocusIn: true,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  )
  const [viewportRef, api] = useEmblaCarousel({ align: 'start', loop: true }, [
    autoplay,
  ])

  // WCAG 2.2.2 needs a way to stop autoplay for good
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion()) {
      setPaused(true)
    }
  }, [])

  useEffect(() => {
    if (!api) {
      return
    }
    if (paused) {
      autoplay.stop()
    } else {
      autoplay.play()
    }
  }, [api, autoplay, paused])

  // Transparent top and bottom borders keep the hover fill off the rules
  const arrow =
    'flex w-12 items-center justify-center border-y border-y-transparent border-l border-l-line bg-clip-padding text-muted-foreground transition-colors hover:bg-card hover:text-foreground'

  return (
    <Section>
      <SectionHeader
        action={
          testimonials.length > 1 ? (
            <>
              <button
                aria-label={paused ? 'Play testimonials' : 'Pause testimonials'}
                className={arrow}
                onClick={() => setPaused((value) => !value)}
                type='button'
              >
                {paused ? (
                  <Icons.play className='size-3.5' />
                ) : (
                  <Icons.pause className='size-3.5' />
                )}
              </button>
              <button
                aria-label='Previous testimonial'
                className={arrow}
                onClick={() => api?.scrollPrev()}
                type='button'
              >
                <Icons.chevronLeft className='size-4' />
              </button>
              <button
                aria-label='Next testimonial'
                className={arrow}
                onClick={() => api?.scrollNext()}
                type='button'
              >
                <Icons.chevronRight className='size-4' />
              </button>
            </>
          ) : null
        }
        title='Testimonials'
      />
      <section
        aria-label='Testimonials'
        aria-roledescription='carousel'
        // pb-px keeps the hover fill off the section's bottom rule
        className='overflow-hidden pb-px'
        ref={viewportRef}
      >
        <ul className='flex'>
          {testimonials.map((testimonial, index) => (
            <li
              aria-label={`${index + 1} of ${testimonials.length}`}
              aria-roledescription='slide'
              className='w-[85%] shrink-0 border-line border-r sm:w-1/2'
              data-reveal-item
              key={testimonial.author.name}
            >
              <TestimonialCard testimonial={testimonial} />
            </li>
          ))}
        </ul>
      </section>
    </Section>
  )
}

export default Testimonials
