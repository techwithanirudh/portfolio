import { socials } from '@/app/layout.shared';
import { SectionHeader } from '@/components/sections/section-header';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ViewAnimation } from '@/components/view-animation';
import Balancer from 'react-wrap-balancer';

export const Hero = () => (
  <div className='flex flex-col gap-2'>
    <SectionHeader
      title="Contact Me"
      description="Have a question or want to connect? Send a message and expect a response within a week."
      align="left"
    />
    <TooltipProvider>
      <div className='mt-4 flex w-min flex-row gap-4 rounded-full bg-muted p-1.5 text-muted-foreground'>
        {socials.map((social, index) => (
          <ViewAnimation
            initial={{ opacity: 0, translateY: -8, scale: 0.8 }}
            whileInView={{ opacity: 1, translateY: 0, scale: 1 }}
            delay={0.5 + index * 0.1}
            key={social.url}
          >
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <a
                  key={social.name}
                  href={social.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center justify-center rounded-full p-2 text-muted-foreground transition-colors transition-transform hover:scale-125 hover:bg-accent hover:text-accent-foreground [&_svg]:size-5'
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
    </TooltipProvider>
  </div>
);
