'use client'

import { useEffect, useRef, useState } from 'react'
import { Icons } from '@/components/icons/icons'
import { Section } from '@/components/layout/sections'
import { SectionHeader } from '@/components/layout/sections/header'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ViewAnimation } from '@/components/view-animation'
import type { Testimonial } from '@/types'

const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()

// Every quote is clamped to the same few lines so the cards line up; the
// long ones get a "more" that opens the rest in place
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
  const trackRef = useRef<HTMLUListElement>(null)
  const [edges, setEdges] = useState({ end: false, start: true })

  useEffect(() => {
    const track = trackRef.current
    if (!track) {
      return
    }
    const update = () =>
      setEdges({
        end: track.scrollLeft + track.clientWidth >= track.scrollWidth - 1,
        start: track.scrollLeft <= 1,
      })
    update()
    track.addEventListener('scroll', update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(track)
    return () => {
      track.removeEventListener('scroll', update)
      observer.disconnect()
    }
  }, [])

  const step = (direction: 1 | -1) => {
    const track = trackRef.current
    const card = track?.firstElementChild
    if (track && card) {
      track.scrollBy({
        behavior: 'smooth',
        left: direction * card.getBoundingClientRect().width,
      })
    }
  }

  const arrow =
    'flex w-12 items-center justify-center border-line border-l text-muted-foreground transition-colors hover:bg-card hover:text-foreground disabled:pointer-events-none disabled:opacity-30'

  return (
    <Section>
      <SectionHeader
        action={
          testimonials.length > 1 ? (
            <>
              <button
                aria-label='Previous testimonial'
                className={arrow}
                data-sound-hover
                disabled={edges.start}
                onClick={() => step(-1)}
                type='button'
              >
                <Icons.chevronLeft className='size-4' />
              </button>
              <button
                aria-label='Next testimonial'
                className={arrow}
                data-sound-hover
                disabled={edges.end}
                onClick={() => step(1)}
                type='button'
              >
                <Icons.chevronRight className='size-4' />
              </button>
            </>
          ) : null
        }
        title='Testimonials'
      />
      <ul
        aria-label='Testimonials'
        className='no-scrollbar flex snap-x snap-mandatory divide-x divide-line overflow-x-auto overscroll-x-contain'
        ref={trackRef}
      >
        {testimonials.map((testimonial) => (
          <ViewAnimation
            as='li'
            className='w-[85%] shrink-0 snap-start sm:w-1/2'
            key={testimonial.author.name}
          >
            <TestimonialCard testimonial={testimonial} />
          </ViewAnimation>
        ))}
      </ul>
    </Section>
  )
}

export default Testimonials
