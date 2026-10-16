import Link from 'next/link'
import { AskSimbaButton } from '@/components/features/assistant/ask-simba-button'
import { Icons } from '@/components/icons/icons'
import { Section } from '@/components/layout/sections'
import { GrainBackdrop } from '@/components/shader/grain-backdrop'
import { buttonVariants } from '@/components/ui/button'
import { ViewAnimation } from '@/components/view-animation'
import { socials } from '@/constants/navigation'
import { cn } from '@/lib/utils'
import { Portrait } from './portrait'

// One column, type first: portrait, name, one line, actions, with the grain
// blob drifting in from the corner
const Hero = () => (
  <Section className='relative isolate flex flex-col overflow-hidden px-6 pt-16 pb-14 sm:px-12 sm:pt-20 sm:pb-16'>
    <GrainBackdrop className='-z-10' />
    <ViewAnimation delay={0.05}>
      <div className='mb-7 size-16 overflow-hidden rounded-2xl border border-foreground/15 shadow-sm sm:mb-8 sm:size-[4.75rem] sm:rounded-[1.25rem]'>
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
        the code behind them, lately AI products with Next.js, React and
        TypeScript, as a Software Engineering Intern at{' '}
        <a
          className='underline decoration-foreground/30 decoration-dashed underline-offset-4 transition-colors hover:text-primary hover:decoration-primary'
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
        {socials.map((social) => (
          <a
            aria-label={social.name}
            className={cn(
              buttonVariants({ size: 'icon-sm', variant: 'outline' }),
              'text-muted-foreground hover:-translate-y-0.5 hover:text-foreground dark:bg-background dark:ring-white/10'
            )}
            href={social.url}
            key={social.name}
            rel='noreferrer'
            target={social.url.startsWith('mailto:') ? undefined : '_blank'}
          >
            {social.icon}
          </a>
        ))}
      </ViewAnimation>
    </div>
  </Section>
)

export default Hero
