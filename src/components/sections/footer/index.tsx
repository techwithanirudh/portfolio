import { owner } from '@/app/layout.shared'
import { UserButton } from '@/components/auth/user-button'
import { ThemeToggle } from '@/components/theme-toggle'
import { ViewAnimation } from '@/components/view-animation'
import { cn } from '@/lib/utils'
import { Links } from './links'

export const Footer = () => (
  <footer
    className={cn(
      'container mx-auto flex flex-col gap-4 px-4 py-8',
      'border-border border-b border-dashed',
      'sm:gap-16 sm:px-8 sm:py-16'
    )}
  >
    <Links />
    <div className='grid items-center gap-4 sm:grid-cols-3'>
      <ViewAnimation
        className='w-min'
        delay={0.6}
        initial={{ opacity: 0, translateY: -8 }}
        whileInView={{ opacity: 1, translateY: 0 }}
      >
        <UserButton />
      </ViewAnimation>
      <div className='flex items-center sm:justify-center'>
        <ViewAnimation
          delay={0.7}
          initial={{ opacity: 0, translateY: -8 }}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          <p className='whitespace-nowrap text-muted-foreground text-sm'>
            &copy; {new Date().getFullYear()} {owner}. All rights reserved.
          </p>
        </ViewAnimation>
      </div>
      <div className='flex items-center sm:justify-end'>
        <ViewAnimation
          delay={0.8}
          initial={{ opacity: 0, translateY: -8 }}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          <ThemeToggle mode='light-dark-system' />
        </ViewAnimation>
      </div>
    </div>
  </footer>
)
