import Link from 'next/link'
import type { ReactNode } from 'react'
import { SimbaLoop } from '@/components/features/assistant/mascot/simba-loop'
import { Icons } from '@/components/icons/icons'
import { RuledGrid } from '@/components/layout/ruled-grid'
import { Section } from '@/components/layout/sections'
import { SectionHeader } from '@/components/layout/sections/header'
import { profile } from '@/constants/portfolio/profile'
import { cn } from '@/lib/utils'
import { getActivityItems } from './feed/data'
import { GitHubEvent, getEventUrl } from './feed/event'

const Card = ({
  children,
  className,
  label,
}: {
  children: ReactNode
  className?: string
  label: string
}) => (
  <div className={cn('flex flex-col gap-3 bg-background p-4', className)}>
    <span className='font-mono text-muted-foreground text-xs'>{label}</span>
    {children}
  </div>
)

const LinkCard = ({
  description,
  href,
  label,
  title,
}: {
  description: string
  href: string
  label: string
  title: string
}) => (
  <Link
    className='group flex flex-col gap-3 bg-background p-4 transition-colors hover:bg-card'
    data-sound-hover
    href={href}
  >
    <span className='font-mono text-muted-foreground text-xs'>{label}</span>
    <span className='flex items-center justify-between gap-2 font-medium'>
      {title}
      <Icons.arrowRight className='size-4 text-muted-foreground transition-[rotate,color] duration-300 group-hover:-rotate-45 group-hover:text-foreground' />
    </span>
    <span className='text-muted-foreground text-sm'>{description}</span>
  </Link>
)

const stats = [
  { label: 'Writing code since', value: '2022' },
  { label: 'Commits, give or take', value: '2,600+' },
  { label: 'Repos worth keeping', value: '16' },
  { label: 'Mostly in', value: 'TypeScript' },
]

const recentActivity = async () => {
  try {
    return (await getActivityItems()).slice(0, 4)
  } catch {
    return []
  }
}

export default async function More(): Promise<React.ReactElement> {
  const activity = await recentActivity()

  return (
    <Section>
      <SectionHeader
        description='The bits that do not fit anywhere else.'
        title='More'
      />
      <RuledGrid className='grid-cols-1 sm:grid-cols-2'>
        <Card className='sm:row-span-2' label='Meet Simba'>
          <div className='flex flex-1 items-end justify-center py-4'>
            <SimbaLoop animation='Greet' pause={2400} />
          </div>
          <p className='text-muted-foreground text-sm'>
            My dog, and the face of the assistant in the corner. Ask him
            anything about me.
          </p>
        </Card>
        <Card label='Based in'>
          <span className='font-medium'>{profile.location}</span>
          <span className='text-muted-foreground text-sm'>
            Working on IST, usually with something compiling in the background.
          </span>
        </Card>
        <Card label='By the numbers'>
          <dl className='grid grid-cols-2 gap-3'>
            {stats.map(({ label, value }) => (
              <div key={label}>
                <dt className='text-muted-foreground text-xs'>{label}</dt>
                <dd className='font-medium font-mono tabular-nums'>{value}</dd>
              </div>
            ))}
          </dl>
        </Card>
        <LinkCard
          description='The hardware, apps and tools I use every day.'
          href='/uses'
          label='Setup'
          title='What I use'
        />
        {activity.length > 0 ? (
          <Card className='sm:col-span-2' label='Lately on GitHub'>
            <ul className='divide-y divide-line font-mono text-muted-foreground text-xs'>
              {activity.map((item) => (
                <li className='min-w-0' key={item.event.id}>
                  <a
                    className='block py-2 transition-colors hover:text-foreground'
                    href={getEventUrl(item.event, item.commits)}
                    rel='noopener noreferrer'
                    target='_blank'
                  >
                    <GitHubEvent commits={item.commits} event={item.event} />
                  </a>
                </li>
              ))}
            </ul>
          </Card>
        ) : null}
        <LinkCard
          description='Leave a note, say hi, or just sign your name.'
          href='/guestbook'
          label='Guestbook'
          title='Sign the wall'
        />
        <LinkCard
          description='Fonts, stack and the credits behind this site.'
          href='/colophon'
          label='Colophon'
          title='How this site is made'
        />
      </RuledGrid>
    </Section>
  )
}
