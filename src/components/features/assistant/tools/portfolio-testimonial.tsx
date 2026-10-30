import { TestimonialAuthor } from '@/components/features/testimonial-author'
import type { Testimonial } from '@/types'

export const TestimonialQuote = ({
  testimonial,
}: {
  testimonial: Testimonial
}) => (
  <figure className='flex flex-col gap-3 px-3 wide:px-4 py-3 wide:py-5'>
    <div className='flex flex-col gap-0.5'>
      <h4 className='font-medium text-sm wide:text-base tracking-tight'>
        {testimonial.title}
      </h4>
      <blockquote className='line-clamp-4 wide:line-clamp-none text-pretty text-[13px] text-muted-foreground wide:text-sm'>
        {testimonial.description}
      </blockquote>
    </div>
    <figcaption>
      <TestimonialAuthor author={testimonial.author} />
    </figcaption>
  </figure>
)
