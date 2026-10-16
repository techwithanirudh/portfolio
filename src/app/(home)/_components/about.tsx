import Link from 'next/link'
import { Icons } from '@/components/icons/icons'
import { SectionHeader } from '@/components/layout/sections/header'
import {
  SplitSection,
  SplitSectionContent,
  SplitSectionSidebar,
} from '@/components/layout/sections/split'
import { Prose } from '@/components/prose'
import { buttonVariants } from '@/components/ui/button'
import { ViewAnimation } from '@/components/view-animation'
import { cn } from '@/lib/utils'

export default function About(): React.ReactElement {
  return (
    <SplitSection>
      <SplitSectionSidebar>
        <SectionHeader align='left' title='About me' />
      </SplitSectionSidebar>

      <SplitSectionContent inset>
        <ViewAnimation className='relative' delay={0.1}>
          <div className='space-y-4'>
            <Prose className='typography-body w-full space-y-4'>
              <p className='text-lg'>
                I'm Anirudh, a full-stack developer who builds practical web
                apps. I started tinkering with Lego Mindstorms and kept building
                from there.
              </p>
              <p className='text-lg'>
                My stack is Next.js, TypeScript, tRPC, Drizzle, and PostgreSQL.
                Python was part of my early experiments. I build open-source
                projects like{' '}
                <Link className='whitespace-nowrap' href='/projects/ai_tutor'>
                  AI Tutor
                </Link>{' '}
                and{' '}
                <Link
                  className='whitespace-nowrap'
                  href='/projects/coolify_tweaks'
                >
                  Coolify Tweaks
                </Link>
                .
              </p>
            </Prose>
            <Link
              className={cn(
                buttonVariants({
                  size: 'lg',
                  variant: 'link',
                }),
                '!p-0 h-fit'
              )}
              href='/about'
            >
              Learn more
              <Icons.arrowRight className='icon-arrow-button size-4' />
            </Link>
          </div>
        </ViewAnimation>
      </SplitSectionContent>
    </SplitSection>
  )
}
