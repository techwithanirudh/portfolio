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
    {/* Side by side cells share one height, so uneven quotes stop reading
        as a lopsided stack */}
    <ul className='grid divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0'>
      {testimonials.slice(0, 3).map((testimonial, index) => (
        <ViewAnimation
          as='li'
          blur={false}
          className='group flex flex-col justify-between gap-4 p-4 transition-colors hover:bg-card'
          delay={0.05 * index}
          initial={{ opacity: 0, translateY: -6 }}
          key={testimonial.author.name}
          whileInView={{ opacity: 1, translateY: 0 }}
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
              className='size-5 transition-transform duration-300 group-hover:scale-125'
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
