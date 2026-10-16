import { Icons } from '@/components/icons/icons'
import { Section } from '@/components/layout/sections'
import { SectionHeader } from '@/components/layout/sections/header'
import { buttonVariants } from '@/components/ui/button'
import { ViewAnimation } from '@/components/view-animation'
import { owner } from '@/constants/config'
import { cn } from '@/lib/utils'

// Heads the contributions graph and the feed, which are sections of their own
export default function ActivityHeader(): React.ReactElement {
  return (
    <Section className='flex flex-wrap items-end justify-between gap-6 px-6 pt-10 pb-10'>
      <SectionHeader
        align='left'
        description='What I have been up to on GitHub.'
        title='Activity'
      />
      <ViewAnimation delay={0.15}>
        <a
          className={cn(
            buttonVariants({ size: 'sm', variant: 'outline' }),
            'group/button'
          )}
          href={`https://github.com/${owner}`}
          rel='noreferrer'
          target='_blank'
        >
          <Icons.github />
          GitHub
          <Icons.arrowUpRight className='transition-transform group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5' />
        </a>
      </ViewAnimation>
    </Section>
  )
}
