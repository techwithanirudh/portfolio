import Link from 'next/link'
import { AskSimbaButton } from '@/components/features/assistant/ask-simba-button'
import { Icons } from '@/components/icons/icons'
import { Section } from '@/components/layout/sections'
import { GrainBackdrop } from '@/components/shader/grain-backdrop'
import { buttonVariants } from '@/components/ui/button'
import { ViewAnimation } from '@/components/view-animation'
import { socials } from '@/constants/navigation'
import { cn } from '@/lib/utils'
import { CopyEmailButton } from './copy-email-button'
import { Portrait } from './portrait'

const socialClassName = cn(
  buttonVariants({ size: 'icon-sm', variant: 'outline' }),
  // Only the icon moves, so the hit area stays put and hover can't flicker
  'text-muted-foreground hover:text-foreground dark:bg-background dark:ring-white/10',
  '[&_svg]:transition-[opacity,filter,scale,rotate] [&_svg]:duration-200 [&_svg]:ease-out hover:[&_svg]:-rotate-8 hover:[&_svg]:scale-115 motion-reduce:[&_svg]:transition-none'
)

// One column, type first: portrait, name, one line, actions, with the grain
// blob drifting in from the corner
const Hero = () => (
  <Section className='relative isolate flex flex-col overflow-hidden px-6 pt-16 pb-14 sm:px-12 sm:pt-20 sm:pb-16'>
    <GrainBackdrop className='-z-10' />
    <ViewAnimation delay={0.05}>
      <div className='mb-7 size-16 overflow-hidden rounded-lg border border-foreground/10 sm:mb-8 sm:size-[4.75rem] sm:rounded-xl'>
        <Portrait />
      </div>
    </ViewAnimation>
    <ViewAnimation delay={0.1}>
      <h1 className='mb-4 text-balance font-medium text-[2.4rem] leading-[1.02] tracking-[-0.04em] sm:mb-5 sm:text-[3.4rem]'>
        Anirudh Sriram<span className='text-primary'>.</span>
      </h1>
    </ViewAnimation>
    <ViewAnimation delay={0.15}>
      <p className='max-w-[58ch] text-pretty text-base text-foreground/85 leading-relaxed sm:text-[1.09rem]'>
        Design engineer and full-stack developer. I design websites and write
        the code behind them. Right now that means AI products with Next.js,
        React and TypeScript, as a software engineering intern at{' '}
        <a
          className='link-underline'
          href='https://quiver.ai'
          rel='noreferrer'
          target='_blank'
        >
          QuiverAI
        </a>
        .
      </p>
    </ViewAnimation>

    <div className='mt-7 flex flex-wrap items-center gap-2.5 sm:mt-9'>
      <ViewAnimation delay={0.2}>
        <Link
          className={buttonVariants({ size: 'lg', variant: 'default' })}
          href='/projects'
        >
          Projects
          <Icons.arrowRight className='icon-arrow-button size-4' />
        </Link>
      </ViewAnimation>
      <ViewAnimation delay={0.25}>
        <AskSimbaButton />
      </ViewAnimation>
      <ViewAnimation
        className='flex w-full gap-1.5 max-sm:mt-2 sm:ml-auto sm:w-auto'
        delay={0.3}
      >
        {socials.map((social) =>
          social.url.startsWith('mailto:') ? (
            <CopyEmailButton
              className={socialClassName}
              email={social.url.replace('mailto:', '')}
              key={social.name}
            />
          ) : (
            <a
              aria-label={social.name}
              className={socialClassName}
              href={social.url}
              key={social.name}
              rel='noreferrer'
              target='_blank'
            >
              {social.icon}
            </a>
          )
        )}
      </ViewAnimation>
    </div>
  </Section>
)

export default Hero
