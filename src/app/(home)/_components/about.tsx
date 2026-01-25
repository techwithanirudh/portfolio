import Link from 'next/link'
import { Icons } from '@/components/icons/icons'
import { Section } from '@/components/section'
import { buttonVariants } from '@/components/ui/button'
import { ViewAnimation } from '@/components/view-animation'
import { cn } from '@/lib/utils'

export default function About(): React.ReactElement {
  return (
    <Section className='grid divide-y divide-dashed divide-border lg:grid-cols-2 lg:divide-x lg:divide-y-0'>
      <ViewAnimation
        className='flex h-full flex-col gap-2 px-6 py-10 md:py-14'
        initial={{ opacity: 0, translateY: -6 }}
        whileInView={{ opacity: 1, translateY: 0 }}
      >
        <h4 className='text-left font-regular text-3xl tracking-tighter md:text-5xl'>
          About Me
        </h4>
      </ViewAnimation>

      <ViewAnimation
        className='relative'
        delay={0.1}
        initial={{ opacity: 0, translateY: -6 }}
        whileInView={{ opacity: 1, translateY: 0 }}
      >
        <div className='space-y-4 px-6 py-10 md:py-14'>
          <div className='prose dark:prose-invert typography-body w-full space-y-4'>
            <p className='text-lg'>
              I'm Anirudh, a full-stack developer who builds practical web apps.
              I started tinkering with Lego Mindstorms and kept building from
              there.
            </p>
            <p className='text-lg'>
              My stack is Next.js, TypeScript, tRPC, Drizzle, and PostgreSQL.
              Python was part of my early experiments. I build open-source
              projects like AI Tutor and Coolify Tweaks.
            </p>
          </div>
          <Link
            className={cn(
              buttonVariants({
                variant: 'link',
                size: 'lg',
              }),
              'group !p-0 h-fit'
            )}
            href='/about'
          >
            Learn More
            <Icons.arrowRight className='size-4 transition-transform group-hover:-rotate-45 group-hover:translate-x-0.5' />
          </Link>
        </div>
      </ViewAnimation>
    </Section>
  )
}
