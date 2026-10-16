import { UserButton } from '@/components/features/auth'
import { GuestbookBand } from '@/components/guestbook-cue'
import { Clock } from '@/components/layout/footer/clock'
import { SoundToggle } from '@/components/layout/footer/sound-toggle'
import { ThemeToggle } from '@/components/layout/header/theme-toggle'
import { ViewAnimation } from '@/components/view-animation'
import { owner } from '@/constants/site'
import { cn } from '@/lib/utils'
import { Links } from './links'

export const Footer = () => (
  <>
    <GuestbookBand before='since you read all the way down here, leave proof you were here in the' />
    <footer
      className={cn(
        'container mx-auto flex flex-col gap-6 px-4 py-6 pb-24',
        'border-border border-b border-dashed',
        'sm:gap-16 sm:px-8 sm:pt-16 sm:pb-24 md:pb-16'
      )}
    >
      <Links />
      <div className='grid items-center gap-4 sm:grid-cols-3'>
        <ViewAnimation className='hidden w-min sm:flex' delay={0.1}>
          <UserButton className='size-9' />
        </ViewAnimation>
        <div className='flex items-center justify-center'>
          <ViewAnimation delay={0.15}>
            <p className='text-balance text-center text-muted-foreground text-sm'>
              &copy; {new Date().getFullYear()} {owner}. All rights reserved.
            </p>
          </ViewAnimation>
        </div>
        <ViewAnimation
          className='hidden items-center gap-2 sm:flex sm:justify-end'
          delay={0.2}
        >
          <Clock />
          <SoundToggle />
          <ThemeToggle mode='light-dark-system' />
        </ViewAnimation>
        <div className='flex flex-wrap items-center justify-between gap-3 sm:hidden'>
          <ViewAnimation className='w-min' delay={0.1}>
            <UserButton className='size-9' />
          </ViewAnimation>
          <ViewAnimation
            className='flex flex-wrap items-center gap-2'
            delay={0.2}
          >
            <Clock />
            <SoundToggle />
            <ThemeToggle mode='light-dark-system' />
          </ViewAnimation>
        </div>
      </div>
    </footer>
  </>
)
