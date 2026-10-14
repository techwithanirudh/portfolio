import Link from 'next/link'
import { Icons } from '@/components/icons/icons'
import {
  Panel,
  PanelContent,
  PanelHeader,
  PanelTitle,
} from '@/components/layout/panel'
import { buttonVariants } from '@/components/ui/button'
import { ViewAnimation } from '@/components/view-animation'
import { cn } from '@/lib/utils'

const Contact = () => (
  <Panel>
    <PanelHeader>
      <PanelTitle>Get in touch</PanelTitle>
    </PanelHeader>
    <ViewAnimation
      initial={{ opacity: 0, translateY: -6 }}
      whileInView={{ opacity: 1, translateY: 0 }}
    >
      <PanelContent className='flex flex-col gap-4'>
        <p className='max-w-md text-pretty text-muted-foreground text-sm leading-relaxed'>
          Got a question, an idea, or a weird project? My inbox is open, and the
          dog is always listening.
        </p>
        <div className='flex flex-wrap items-center gap-2'>
          <Link
            className={cn(
              buttonVariants({ size: 'lg', variant: 'default' }),
              'rounded-full'
            )}
            href='/contact'
          >
            Contact me
            <Icons.arrowRight className='icon-arrow-button size-4' />
          </Link>
          <a
            className='font-mono text-muted-foreground text-xs transition-colors hover:text-foreground'
            href='mailto:hello@techwithanirudh.com'
          >
            hello@techwithanirudh.com
          </a>
        </div>
      </PanelContent>
    </ViewAnimation>
  </Panel>
)

export default Contact
