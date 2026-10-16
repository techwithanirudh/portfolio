import { SectionHeader } from '@/components/layout/sections/header'
import { TitleDot } from '@/components/layout/sections/hero'
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
      as='h1'
      description="Have a question or want to work together? Send a message and I'll reply within a week."
      title={
        <>
          Contact
          <TitleDot />
        </>
      }
    />
    <div className='mt-4 flex w-min flex-row gap-4 rounded-full bg-card p-1.5 text-card-foreground'>
      {socials.map((social, index) => (
        <ViewAnimation delay={0.05 * index} key={social.url}>
          <Tooltip>
            <TooltipTrigger
              render={
                <a
                  aria-label={social.name}
                  className='icon-pop flex items-center justify-center rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground [&_svg]:size-5'
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
