import { Section } from '@/components/layout/sections'
import { SectionLabel } from '@/components/layout/sections/label'
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
  <Section className='flex flex-col gap-4 py-6'>
    <SectionLabel>kind_words</SectionLabel>
    <ul className='divide-y divide-dashed divide-border border-border border-y border-dashed'>
      {testimonials.slice(0, 3).map((testimonial, index) => (
        <ViewAnimation
          blur={false}
          delay={0.05 * index}
          initial={{ opacity: 0, translateY: -6 }}
          key={testimonial.author.name}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          <li className='flex flex-col gap-3 px-4 py-4 sm:px-6'>
            <blockquote className='text-pretty text-muted-foreground text-sm leading-relaxed'>
              <span aria-hidden className='font-mono text-primary'>
                "
              </span>
              {testimonial.description}
            </blockquote>
            <p className='flex items-center gap-2 font-mono text-xs'>
              <Avatar className='size-5' outlined={false}>
                <AvatarImage alt='' src={testimonial.author.image} />
                <AvatarFallback>
                  {initials(testimonial.author.name)}
                </AvatarFallback>
              </Avatar>
              {testimonial.author.name}
            </p>
          </li>
        </ViewAnimation>
      ))}
    </ul>
  </Section>
)

export default Testimonials
