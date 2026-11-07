import Link from 'next/link'
import { Icons } from '@/components/icons/icons'
import { InlineMarkdown } from '@/components/inline-markdown'
import { SectionHeader } from '@/components/layout/sections/header'
import {
  SplitSection,
  SplitSectionContent,
  SplitSectionSidebar,
} from '@/components/layout/sections/split'
import { Prose } from '@/components/prose'
import { buttonVariants } from '@/components/ui/button'
import { ViewAnimation } from '@/components/view-animation'
import { pages } from '@/constants/pages'
import { aboutIntro } from '@/constants/portfolio/intro'
import { cn } from '@/lib/utils'

export default function About(): React.ReactElement {
  return (
    <SplitSection>
      <SplitSectionSidebar className='py-6 sm:py-8'>
        <SectionHeader align='left' title='About me' />
      </SplitSectionSidebar>

      <SplitSectionContent className='py-6 sm:py-8' inset>
        <ViewAnimation className='relative' delay={0.1}>
          <div className='space-y-3 sm:space-y-4'>
            <Prose className='typography-body w-full space-y-4'>
              {aboutIntro.map((paragraph, index) => (
                // Phones read the first paragraph; "Learn more" carries the rest
                <p
                  className={cn('sm:text-lg', index > 0 && 'max-sm:hidden')}
                  key={paragraph}
                >
                  <InlineMarkdown
                    linkClassName='whitespace-nowrap'
                    text={paragraph}
                  />
                </p>
              ))}
            </Prose>
            <Link
              className={cn(
                buttonVariants({
                  size: 'lg',
                  variant: 'link',
                }),
                '!p-0 h-fit'
              )}
              href={pages.about.path}
            >
              Learn more
              <span className='sr-only'> about me</span>
              <Icons.arrowRight className='icon-arrow-button size-4' />
            </Link>
          </div>
        </ViewAnimation>
      </SplitSectionContent>
    </SplitSection>
  )
}
