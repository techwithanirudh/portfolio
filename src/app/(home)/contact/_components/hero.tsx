import { socials } from '@/app/layout.config';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Balancer from 'react-wrap-balancer';

export const Hero = () => (
  <div className='flex flex-col gap-2'>
    <h4 className='max-w-xl text-left font-regular text-3xl tracking-tighter md:text-5xl'>
      Contact Me
    </h4>
    <p className='max-w-xl text-left text-lg text-muted-foreground leading-relaxed tracking-tight lg:max-w-lg'>
      <Balancer>Have a question or want to connect? Send a message and expect a response
      within a week.</Balancer>
    </p>
    <TooltipProvider>
      <div className='mt-4 flex w-min flex-row gap-4 rounded-full bg-muted p-1.5 text-muted-foreground'>
        {socials.map((social) => (
          <Tooltip key={social.url} delayDuration={0}>
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
        ))}
      </div>
    </TooltipProvider>
  </div>
);
