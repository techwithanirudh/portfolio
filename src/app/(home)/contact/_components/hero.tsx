import { HeroSection } from '@/components/layout/sections/hero'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { socials } from '@/constants/navigation'

// The standard page header with the socials under it
export const Hero = () => (
  <HeroSection
    description="Have a question or want to work together? Send a message and I'll reply within a week."
    title='Contact'
  >
    <div className='flex w-min flex-row gap-4 rounded-full bg-card p-1.5 text-card-foreground'>
      {socials.map((social) => (
        <Tooltip key={social.url}>
          <TooltipTrigger
            render={
              <a
                aria-label={social.name}
                className='icon-pop flex items-center justify-center rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground [&_svg]:size-5'
                href={social.url}
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
      ))}
    </div>
  </HeroSection>
)
