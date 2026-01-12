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
            initial={{ opacity: 0, translateY: -8 }}
            whileInView={{ opacity: 1, translateY: 0 }}
          >
            <div className='flex flex-col gap-1.5 p-8 sm:sticky sm:top-16'>
              <h2 className='font-semibold text-2xl'>About</h2>
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
            delay={0.6}
            initial={{ opacity: 0, translateY: -8 }}
            whileInView={{ opacity: 1, translateY: 0 }}
          >
            <div className='space-y-6 p-8 text-lg text-muted-foreground'>
              <p>
                Hi, I'm Anirudh. I'm a full-stack developer who builds web apps
                and AI tools.
              </p>
              <p>
                My stack is Next.js, TypeScript, tRPC, Drizzle, and PostgreSQL.
                Python was part of my earlier AI experiments, but today I focus
                on shipping product-grade web apps.
              </p>
              <p>
                I've worked on research projects around privacy for autonomous
                vehicles and shared a few write-ups along the way.
              </p>
              <p>
                I'm building projects like AI Tutor and Coolify Tweaks and
                sharing them in open source.
              </p>
              <p>
                In my free time, I enjoy 80s music and sharing my builds online.
              </p>
              <Link
                className={cn(
                  buttonVariants({ variant: 'link', size: 'lg' }),
                  'group !p-0 h-fit'
                )}
                href='/work'
              >
                View Work
                <Icons.arrowUpRight className='size-4 transition-transform group-hover:-rotate-12' />
              </Link>
            </div>
          </ViewAnimation>
        </div>
      </div>
    </Section>
  )
}
