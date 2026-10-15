import Link from 'next/link'
import { Icons } from '@/components/icons/icons'
import {
  SplitSection,
  SplitSectionContent,
  SplitSectionHeader,
  SplitSectionSidebar,
} from '@/components/layout/sections/split'
import { buttonVariants } from '@/components/ui/button'
import { ViewAnimation } from '@/components/view-animation'
import { cn } from '@/lib/utils'

export default function Detailed(): React.ReactElement {
  return (
    <SplitSection cols='three'>
      <SplitSectionSidebar background='dashed'>
        <SplitSectionHeader
          description="A quick look at my background, focus, and what I'm building next."
          sticky
          title='Overview'
        />
      </SplitSectionSidebar>
      <SplitSectionContent className='lg:col-span-2' inset>
        <ViewAnimation
          className='h-full'
          delay={0.1}
          initial={{ opacity: 0, translateY: -6 }}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          <div className='space-y-6 text-lg text-muted-foreground'>
            <p>
              Hi, I'm Anirudh. I'm a self-taught software engineer and a student
              who loves building things with code. I grew up playing with
              computers, and now I spend my time learning new tools and getting
              better at what I do.
            </p>
            <p>
              If you're curious, I started with Lego sets as a kid, building,
              breaking, and rebuilding whatever I could think of. That turned
              into making things with code. I moved from robots and gadgets to
              websites and apps, and since then I've spent a lot of hours
              coding, planning projects, and fixing bugs that taught me more
              than any tutorial did.
            </p>
            <Link
              className={cn(
                buttonVariants({ size: 'lg', variant: 'link' }),
                '!p-0 h-fit'
              )}
              href='/work'
            >
              View Work
              <Icons.arrowRight className='icon-arrow-button size-4' />
            </Link>
          </div>
        </ViewAnimation>
      </SplitSectionContent>
    </SplitSection>
  )
}
