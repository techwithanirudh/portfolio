import Image from 'next/image'
import { Section } from '@/components/layout/sections'
import { SectionHeader } from '@/components/layout/sections/header'
import { SectionMoreLink } from '@/components/layout/sections/more-link'
import { Badge } from '@/components/ui/badge'
import { ViewAnimation } from '@/components/view-animation'
import { technologies } from '@/constants/portfolio/skills'
import { cn } from '@/lib/utils'
import type { TechStackItem } from '@/types'

const groupByCategory = (items: TechStackItem[]) => {
  const grouped = new Map<string, TechStackItem[]>()

  for (const item of items) {
    for (const category of item.categories) {
      grouped.set(category, [...(grouped.get(category) ?? []), item])
    }
  }

  return [...grouped]
}

const iconClassName =
  'size-3.5 opacity-60 grayscale transition group-hover/tag:opacity-100 group-hover/tag:grayscale-0'

export default function Stack(): React.ReactElement {
  return (
    <Section className='relative w-full pt-10' id='stack'>
      <div className='flex flex-col gap-10'>
        <SectionHeader
          align='left'
          className='px-6'
          description='The tools I reach for most.'
          title='Stack'
        />

        <div>
          <div className='divide-y divide-dashed divide-border border-border border-y border-dashed'>
            {groupByCategory(technologies).map(([category, items], index) => (
              <ViewAnimation
                className='grid items-center gap-y-3 py-6 md:grid-cols-[16rem_1fr]'
                delay={0.05 * index}
                key={category}
              >
                <h3 className='px-6 font-medium'>{category}</h3>
                <ul className='flex flex-wrap gap-2 px-6'>
                  {items.map((item) => (
                    <li className='flex' key={item.label}>
                      <TechBadge item={item} />
                    </li>
                  ))}
                </ul>
              </ViewAnimation>
            ))}
          </div>
          <SectionMoreLink delay={0.1} href='/uses'>
            Everything I use
          </SectionMoreLink>
        </div>
      </div>
    </Section>
  )
}

function TechBadge({ item: { href, icon, label } }: { item: TechStackItem }) {
  return (
    <Badge
      className='group/tag gap-1.5 rounded-full px-2.5 py-1 font-mono text-muted-foreground text-xs transition-colors hover:bg-accent hover:text-foreground'
      render={<a href={href} rel='noreferrer' target='_blank' />}
      variant='outline'
    >
      {typeof icon === 'string' ? (
        <Image
          alt=''
          aria-hidden
          className={iconClassName}
          height={14}
          src={icon}
          unoptimized
          width={14}
        />
      ) : (
        <>
          <Image
            alt=''
            aria-hidden
            className={cn(iconClassName, 'dark:hidden')}
            height={14}
            src={icon.light}
            unoptimized
            width={14}
          />
          <Image
            alt=''
            aria-hidden
            className={cn(iconClassName, 'hidden dark:block')}
            height={14}
            src={icon.dark}
            unoptimized
            width={14}
          />
        </>
      )}
      {label}
    </Badge>
  )
}
