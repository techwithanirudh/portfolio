import { SectionHeader } from '@/components/layout/sections/header'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ViewAnimation } from '@/components/view-animation'
import { socials } from '@/constants/navigation'

export const Hero = () => (
  <div className='flex flex-col'>
    <SectionHeader
      as='h1'
      description="Have a question or want to connect? Send me a message and I'll reply within a week."
      title='Contact Me'
    />
    <div className='screen-line-bottom flex'>
      {socials.map((social, index) => (
        <ViewAnimation
          blur={false}
          className='border-line border-r'
          delay={0.05 * index}
          duration={0.25}
          initial={{ opacity: 0, translateY: -6 }}
          key={social.url}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          <Tooltip>
            <TooltipTrigger
              render={
                <a
                  aria-label={social.name}
                  className='icon-pop flex size-12 items-center justify-center text-muted-foreground transition-colors hover:bg-card hover:text-foreground [&_svg]:size-5'
                  href={social.url}
                  key={social.name}
                  rel='noopener noreferrer'
                  target='_blank'
                />
              }
            >
              {social.icon}
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
