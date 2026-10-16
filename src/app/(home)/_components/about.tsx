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
import { aboutIntro } from '@/constants/portfolio/intro'
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
              {aboutIntro.map((paragraph) => (
                <p className='text-lg' key={paragraph}>
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
