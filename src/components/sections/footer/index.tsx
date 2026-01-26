import { UserButton } from '@daveyplate/better-auth-ui'
import { Clock } from '@/components/clock'
import { ThemeToggle } from '@/components/theme-toggle'
import { ViewAnimation } from '@/components/view-animation'
import { owner } from '@/constants/site'
import { cn } from '@/lib/utils'
import { Links } from './links'

export const Footer = () => (
  <footer
    className={cn(
      'container mx-auto flex flex-col gap-6 px-4 py-6',
      'border-border border-b border-dashed',
      'sm:gap-16 sm:px-8 sm:py-16'
    )}
  >
    <Links />
    <div className='grid items-center gap-4 sm:grid-cols-3'>
      <ViewAnimation
        className='hidden w-min sm:flex'
        delay={0.1}
        initial={{ opacity: 0, translateY: -6 }}
        whileInView={{ opacity: 1, translateY: 0 }}
      >
        <UserButton
          align='start'
          className='rounded-md'
          sideOffset={10}
          size='icon'
        />
      </ViewAnimation>
      <div className='flex items-center justify-center'>
        <ViewAnimation
          delay={0.15}
          initial={{ opacity: 0, translateY: -6 }}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          <p className='whitespace-nowrap text-muted-foreground text-sm'>
            &copy; {new Date().getFullYear()} {owner}. All rights reserved.
          </p>
        </ViewAnimation>
      </div>
      <ViewAnimation
        className='hidden items-center gap-2 sm:flex sm:justify-end'
        delay={0.2}
        initial={{ opacity: 0, translateY: -6 }}
        whileInView={{ opacity: 1, translateY: 0 }}
      >
        <Clock />
        <ThemeToggle mode='light-dark-system' />
      </ViewAnimation>
      <div className='flex items-center justify-between sm:hidden'>
        <ViewAnimation
          className='w-min'
          delay={0.1}
          initial={{ opacity: 0, translateY: -6 }}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          <UserButton
            align='start'
            className='rounded-md'
            sideOffset={10}
            size='icon'
          />
        </ViewAnimation>
        <ViewAnimation
          className='flex items-center gap-2'
          delay={0.2}
          initial={{ opacity: 0, translateY: -6 }}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          <Clock />
          <ThemeToggle mode='light-dark-system' />
        </ViewAnimation>
      </div>
    </div>
  </footer>
)
