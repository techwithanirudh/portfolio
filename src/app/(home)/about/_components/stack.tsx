import Image from 'next/image'
import { ListSection } from '@/components/layout/sections/list-section'
import { Badge } from '@/components/ui/badge'
import { ViewAnimation } from '@/components/view-animation'
import { pages, sectionIds } from '@/constants/pages'
import { groupTechnologies, stackIntro } from '@/constants/portfolio/skills'
import { staggerDelay } from '@/lib/stagger'
import { cn } from '@/lib/utils'
import type { TechStackItem } from '@/types'

const iconClassName =
  'size-3.5 opacity-60 grayscale transition group-hover/tag:opacity-100 group-hover/tag:grayscale-0'

export default function Stack(): React.ReactElement {
  return (
    <ListSection
      description={stackIntro}
      id={sectionIds.stack}
      more={{ delay: 0.1, href: pages.uses.path, label: 'Everything I use' }}
      title='Stack'
    >
      <div className='dashed-stack border-border border-y border-dashed'>
        {groupTechnologies().map(([category, items], index) => (
          <ViewAnimation
            className='grid items-center gap-y-3 py-6 md:grid-cols-[16rem_1fr]'
            delay={staggerDelay(index)}
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
    </ListSection>
  )
}

function TechBadge({ item: { href, icon, label } }: { item: TechStackItem }) {
  return (
    <Badge
      className='group/tag gap-1.5 rounded-full px-2.5 py-1 font-mono text-muted-foreground text-xs transition-colors hover:bg-accent hover:text-foreground'
      render={
        <a aria-label={label} href={href} rel='noreferrer' target='_blank' />
      }
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
