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

const Testimonials = ({ testimonials }: { testimonials: Testimonial[] }) => (
  <Section>
    <SectionHeader title='Testimonials' />
    <ul className='divide-y divide-line'>
      {testimonials.slice(0, 3).map((testimonial, index) => (
        <ViewAnimation
          as='li'
          className='group flex flex-col gap-3 p-4 transition-colors hover:bg-card'
          delay={0.05 * index}
          key={testimonial.author.name}
        >
          <blockquote className='text-pretty text-muted-foreground text-sm leading-relaxed'>
            <span aria-hidden className='text-primary'>
              &ldquo;
            </span>
            {testimonial.description}
            <span aria-hidden className='text-primary'>
              &rdquo;
            </span>
          </blockquote>
          <p className='flex items-center gap-2 font-mono text-xs'>
            <Avatar
              className='size-5 rounded-full transition-transform duration-300 *:rounded-full group-hover:scale-125'
              outlined={false}
            >
              <AvatarImage alt='' src={testimonial.author.image} />
              <AvatarFallback>
                {initials(testimonial.author.name)}
              </AvatarFallback>
            </Avatar>
            {testimonial.author.name}
          </p>
        </ViewAnimation>
      ))}
    </ul>
  </Section>
)

export default Testimonials
