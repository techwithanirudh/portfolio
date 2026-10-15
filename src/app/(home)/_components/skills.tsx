'use client'

import { cva } from 'class-variance-authority'
import Image from 'next/image'
import { Section } from '@/components/layout/sections'
import { SectionHeader } from '@/components/layout/sections/header'
import { PreviewLink } from '@/components/preview-link'
import { Badge } from '@/components/ui/badge'
import { ViewAnimation } from '@/components/view-animation'
import { skills, technologies } from '@/constants/portfolio/skills'
import type { TechStackItem } from '@/types'

const groupByCategory = (items: TechStackItem[]) => {
  const grouped: Record<string, TechStackItem[]> = {}

  for (const item of items) {
    for (const category of item.categories) {
      grouped[category] ??= []
      grouped[category].push(item)
    }
  }

  return grouped
}

const featureItemVariants = cva(
  'flex flex-col justify-between gap-28 p-6 hover:bg-card/80 sm:gap-34 md:gap-40 lg:gap-46',
  {
    defaultVariants: {
      size: 'sm',
    },
    variants: {
      size: {
        lg: 'lg:col-span-2',
        sm: '',
      },
    },
  }
)

const Skills = () => (
  <Section className='relative w-full pt-10' id='stack'>
    <div className='flex flex-col gap-10'>
      <SectionHeader
        align='left'
        className='px-6'
        description='Focused on building practical projects with modern tools'
        title='My Expertise'
      />

      <div className='divider-top-dashed'>
        <div className='grid grid-cols-1 divide-dashed divide-border text-left lg:grid-cols-3 lg:divide-x [&>*:last-child]:border-b-0 lg:[&>*:nth-last-child(-n+3)]:border-b-0 [&>*]:border-border [&>*]:border-b [&>*]:border-dashed'>
          {skills.map((feature, index) => (
            <ViewAnimation
              className={featureItemVariants({
                size: feature.size as 'sm' | 'lg',
              })}
              delay={0.05 * index}
              key={feature.id}
            >
              <feature.Icon className='icon-tilt h-8 w-8' strokeWidth={1} />
              <div className='flex flex-col'>
                <h3 className='text-balance text-xl tracking-tight'>
                  {feature.title}
                </h3>
                <p className='max-w-xs text-pretty text-base text-muted-foreground'>
                  {feature.description}
                </p>
              </div>
            </ViewAnimation>
          ))}
        </div>

        <div className='divider-top-dashed'>
          {Object.entries(groupByCategory(technologies)).map(
            ([category, items], index) => (
              <ViewAnimation
                className='divider-bottom-dashed grid items-center gap-y-2 py-4 last:border-none sm:grid-cols-[10rem_1fr]'
                delay={0.05 * index}
                key={category}
              >
                <div className='px-6 text-muted-foreground text-sm sm:pr-0'>
                  <span
                    aria-hidden
                    className='mr-1.5 select-none font-mono text-muted-foreground/50'
                  >
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                  {category}
                </div>

                <ul className='flex flex-wrap gap-1.5 px-6 sm:pl-0'>
                  {items.map(({ label, icon, href }) => (
                    <li className='flex' key={label}>
                      <Badge
                        className='group/tag gap-1.5 rounded-full px-2.5 py-1 font-mono text-muted-foreground text-xs transition-colors hover:bg-accent hover:text-foreground'
                        render={<PreviewLink href={href} />}
                        variant='outline'
                      >
                        {typeof icon === 'string' ? (
                          <Image
                            alt=''
                            aria-hidden
                            className='size-3.5 opacity-60 grayscale transition group-hover/tag:opacity-100 group-hover/tag:grayscale-0'
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
                              className='size-3.5 opacity-60 grayscale transition group-hover/tag:opacity-100 group-hover/tag:grayscale-0 dark:hidden'
                              height={14}
                              src={icon.light}
                              unoptimized
                              width={14}
                            />
                            <Image
                              alt=''
                              aria-hidden
                              className='hidden size-3.5 opacity-60 grayscale transition group-hover/tag:opacity-100 group-hover/tag:grayscale-0 dark:block'
                              height={14}
                              src={icon.dark}
                              unoptimized
                              width={14}
                            />
                          </>
                        )}
                        {label}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </ViewAnimation>
            )
          )}
        </div>
      </div>
    </div>
  </Section>
)
export default Skills
