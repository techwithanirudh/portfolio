import { SectionHeader } from '@/components/sections/section-header'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ViewAnimation } from '@/components/view-animation'
import { socials } from '@/constants/navigation'

export const Hero = () => (
  <div className='flex flex-col gap-2'>
    <SectionHeader
      align='left'
      description='Have a question or want to connect? Send a message and expect a response within a week.'
      title='Contact Me'
    />
    <div className='mt-4 flex w-min flex-row gap-4 rounded-full bg-card p-1.5 text-card-foreground'>
      {socials.map((social, index) => (
        <ViewAnimation
          blur={false}
          delay={0.05 * index}
          duration={0.25}
          initial={{ opacity: 0, translateY: -6 }}
          key={social.url}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <a
                aria-label={social.name}
                className='[&_svg]:icon-pop flex items-center justify-center rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground [&_svg]:size-5'
                href={social.url}
                key={social.name}
                rel='noopener noreferrer'
                target='_blank'
              >
                {social.icon}
              </a>
            </TooltipTrigger>
            <TooltipContent align='center' side='bottom'>
              <p className='text-sm'>{social.name}</p>
            </TooltipContent>
          </Tooltip>
        </ViewAnimation>
      ))}
    </div>
  </div>
)
