import { cva } from 'class-variance-authority'
import Image from 'next/image'
import { Section } from '@/components/layout/sections'
import { SectionHeader } from '@/components/layout/sections/header'
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
  'group flex min-h-60 flex-col justify-between gap-10 p-4 transition-colors hover:bg-card/80',
  {
    defaultVariants: {
      size: 'sm',
    },
    variants: {
      size: {
        lg: 'sm:col-span-2',
        sm: '',
      },
    },
  }
)

const Skills = () => (
  <Section className='relative w-full' id='stack'>
    <div className='flex flex-col'>
      <SectionHeader
        description='Focused on building practical projects with modern tools.'
        title='Stack'
      />

      <div>
        <div className='grid grid-cols-1 divide-line text-left sm:grid-cols-3 sm:divide-x [&>*:last-child]:border-b-0 sm:[&>*:nth-last-child(-n+3)]:border-b-0 [&>*]:border-line [&>*]:border-b'>
          {skills.map((feature, index) => (
            <ViewAnimation
              className={featureItemVariants({
                size: feature.size as 'sm' | 'lg',
              })}
              delay={0.05 * index}
              initial={{ opacity: 0 }}
              key={feature.id}
              whileInView={{ opacity: 1 }}
            >
              <feature.Icon
                className='size-6 text-muted-foreground transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-125 group-hover:text-primary'
                strokeWidth={1.5}
              />
              <div className='flex flex-col'>
                <h3 className='text-balance font-medium tracking-tight'>
                  {feature.title}
                </h3>
                <p className='max-w-xs text-pretty text-muted-foreground text-sm'>
                  {feature.description}
                </p>
              </div>
            </ViewAnimation>
          ))}
        </div>

        <div className='screen-line-top'>
          {Object.entries(groupByCategory(technologies)).map(
            ([category, items], index) => (
              <ViewAnimation
                className='grid items-center gap-y-2 border-line border-b py-3 last:border-none sm:grid-cols-[9rem_1fr]'
                delay={0.05 * index}
                initial={{ opacity: 0, translateY: -6 }}
                key={category}
                whileInView={{ opacity: 1, translateY: 0 }}
              >
                <div className='px-4 font-mono text-muted-foreground text-xs sm:pr-0'>
                  <span
                    aria-hidden
                    className='mr-1.5 select-none font-mono text-muted-foreground/50'
                  >
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                  {category}
                </div>

                <ul className='flex flex-wrap gap-1.5 px-4 sm:pl-0'>
                  {items.map(({ label, icon, href }) => (
                    <li className='flex' key={label}>
                      <Badge
                        className='group/tag gap-1.5 px-2.5 py-1 font-mono text-muted-foreground text-xs transition-colors hover:bg-accent hover:text-foreground'
                        render={
                          <a
                            href={href}
                            rel='noopener noreferrer'
                            target='_blank'
                          />
                        }
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
