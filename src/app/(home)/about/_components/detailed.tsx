import Link from 'next/link'
import { Icons } from '@/components/icons/icons'
import {
  SplitSection,
  SplitSectionContent,
  SplitSectionHeader,
  SplitSectionSidebar,
} from '@/components/sections/split-section'
import { buttonVariants } from '@/components/ui/button'
import { ViewAnimation } from '@/components/view-animation'
import { cn } from '@/lib/utils'

export default function Detailed(): React.ReactElement {
  return (
    <SplitSection>
      <SplitSectionSidebar background='dashed' sticky>
        <SplitSectionHeader
          description="A quick look at my background, focus, and what I'm building next."
          title='Overview'
        />
      </SplitSectionSidebar>
      <SplitSectionContent>
        <ViewAnimation
          className='h-full'
          delay={0.1}
          initial={{ opacity: 0, translateY: -6 }}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          <div className='space-y-6 p-6 text-lg text-muted-foreground sm:p-8'>
            <p>
              Hi, I'm Anirudh. I'm a self-taught software engineer and a student
              who loves building things with code. I grew up playing with
              computers, and now I'm passionate about learning new technologies
              and always improving my skills.
            </p>
            <p>
              If you're curious, my journey began with Lego sets as a kid,
              building, breaking, and rebuilding anything I could imagine. That
              hands-on curiosity slowly turned into a love for making things
              with code. Over time, I moved from robots and gadgets to websites
              and apps, always chasing the next challenge. Since then, I've
              spent countless hours coding, brainstorming, and wrestling with
              bugs that taught me a lot more than any tutorial ever could.
            </p>
            <Link
              className={cn(
                buttonVariants({ variant: 'link', size: 'lg' }),
                'group !p-0 h-fit'
              )}
              href='/work'
            >
              View Work
              <Icons.arrowRight className='size-4 transition-transform group-hover:-rotate-45' />
            </Link>
          </div>
        </ViewAnimation>
      </SplitSectionContent>
    </SplitSection>
  )
}
