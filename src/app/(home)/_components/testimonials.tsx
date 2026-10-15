import { Panel, PanelHeader, PanelTitle } from '@/components/layout/panel'
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
  <Panel>
    <PanelHeader>
      <PanelTitle>Testimonials</PanelTitle>
    </PanelHeader>
    <ul className='divide-y divide-dashed divide-line'>
      {testimonials.slice(0, 3).map((testimonial, index) => (
        <ViewAnimation
          blur={false}
          delay={0.05 * index}
          initial={{ opacity: 0, translateY: -6 }}
          key={testimonial.author.name}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          <li className='group flex flex-col gap-3 p-4 transition-colors hover:bg-card'>
            <blockquote className='text-pretty text-muted-foreground text-sm leading-relaxed'>
              <span aria-hidden className='font-mono text-primary'>
                "
              </span>
              {testimonial.description}
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
          </li>
        </ViewAnimation>
      ))}
    </ul>
  </Panel>
)

export default Testimonials
