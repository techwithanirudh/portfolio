import Link from 'next/link'
import { Icons } from '@/components/icons/icons'
import { Section } from '@/components/section'
import { buttonVariants } from '@/components/ui/button'
import { ViewAnimation } from '@/components/view-animation'
import { cn } from '@/lib/utils'

export default function Detailed(): React.ReactElement {
  return (
    <Section>
      <div className='grid divide-y divide-dashed divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0'>
        <div className='bg-dashed'>
          <ViewAnimation
            className='h-full'
            initial={{ opacity: 0, translateY: -6 }}
            whileInView={{ opacity: 1, translateY: 0 }}
          >
            <div className='flex flex-col gap-1.5 p-8 sm:sticky sm:top-16'>
              <h2 className='font-semibold text-2xl'>Overview</h2>
              <p className='text-muted-foreground text-sm'>
                A quick look at my background, focus, and what I'm building
                next.
              </p>
            </div>
          </ViewAnimation>
        </div>
        <div className='sm:col-span-2'>
          <ViewAnimation
            className='h-full'
            delay={0.1}
            initial={{ opacity: 0, translateY: -6 }}
            whileInView={{ opacity: 1, translateY: 0 }}
          >
            <div className='space-y-6 p-8 text-lg text-muted-foreground'>
              <p>
                Hi, I'm Anirudh. I'm a self-taught software engineer and a
                student who loves building things with code. I grew up playing
                with computers, and now I'm passionate about learning new
                technologies and always improving my skills.
              </p>
              <p>
                If you're curious, my journey began with Lego sets as a kid,
                building, breaking, and rebuilding anything I could imagine.
                That hands-on curiosity slowly turned into a love for making
                things with code. Over time, I moved from robots and gadgets to
                websites and apps, always chasing the next challenge. Since
                then, I've spent countless hours coding, brainstorming, and
                wrestling with bugs that taught me a lot more than any tutorial
                ever could.
              </p>
              <Link
                className={cn(
                  buttonVariants({ variant: 'link', size: 'lg' }),
                  'group !p-0 h-fit'
                )}
                href='/work'
              >
                View Work
                <Icons.arrowUpRight className='size-4 transition-transform group-hover:-rotate-45 group-hover:translate-x-0.5' />
              </Link>
            </div>
          </ViewAnimation>
        </div>
      </div>
    </Section>
  )
}
