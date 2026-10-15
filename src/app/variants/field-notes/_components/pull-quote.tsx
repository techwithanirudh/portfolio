import Image from 'next/image'
import type { testimonials } from '../../_shared/profile'

type Testimonial = (typeof testimonials)[number]

/** A kind word, clipped out and taped into the notebook. */
export function PullQuote({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure
      className='fn-card fn-tape relative mx-auto max-w-[760px] -rotate-[0.8deg] rounded-[2px] px-6 pt-12 pb-8 sm:px-12 sm:pt-14 sm:pb-10'
      data-tape='corners'
    >
      <span
        aria-hidden
        className='fn-serif pointer-events-none absolute top-1 left-4 select-none text-[6rem] text-[var(--fn-pen)] leading-none opacity-25 sm:left-7 sm:text-[7.5rem]'
      >
        “
      </span>
      <blockquote className='fn-serif relative text-[1.55rem] leading-[1.3] sm:text-[2rem]'>
        <p className='italic'>{testimonial.description}</p>
      </blockquote>
      <figcaption className='mt-6 flex items-center gap-3'>
        {testimonial.author.image ? (
          <Image
            alt=''
            className='size-10 rounded-full object-cover grayscale-[0.3]'
            height={40}
            src={testimonial.author.image}
            width={40}
          />
        ) : null}
        <span className='flex flex-col'>
          <span className='fn-hand text-[1.6rem] leading-none'>
            — {testimonial.author.name}
          </span>
          <span className='fn-label mt-1'>{testimonial.title}</span>
        </span>
      </figcaption>
    </figure>
  )
}
