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
  // One contentinfo landmark for the home page's guestbook band and the links
  <footer className='flex flex-col'>
    <GuestbookBand />
    <div
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
        {/* TODO(slopradar): duplication: UserButton, Clock, SoundToggle and ThemeToggle render twice (desktop row and this sm:hidden row), mounting two clocks and two session readers, lay out one set with responsive grid/order classes */}
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
    </div>
  </footer>
)
