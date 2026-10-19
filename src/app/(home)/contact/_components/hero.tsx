import { externalLinkProps } from '@/components/external-link'
import { SectionHeader } from '@/components/layout/sections/header'
import { TitleDot } from '@/components/layout/sections/hero'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ViewAnimation } from '@/components/view-animation'
import { socials } from '@/constants/navigation'
import { contactIntro } from '@/constants/portfolio/intro'
import { staggerDelay } from '@/lib/stagger'

export const Hero = () => (
  <div className='flex flex-col gap-2'>
    <SectionHeader
      align='left'
      as='h1'
      description={contactIntro}
      title={
        <>
          Contact
          <TitleDot />
        </>
      }
    />
    <div className='mt-4 flex w-min flex-row gap-4 rounded-full bg-card p-1.5 text-card-foreground'>
      {socials.map((social, index) => (
        <ViewAnimation delay={staggerDelay(index)} key={social.url}>
          <Tooltip>
            <TooltipTrigger
              render={
                <a
                  aria-label={social.name}
                  className='icon-pop relative flex items-center justify-center rounded-full p-2 text-muted-foreground after:absolute after:-inset-0.5 hover:bg-accent hover:text-accent-foreground [&_svg]:size-5'
                  href={social.url}
                  {...externalLinkProps}
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
