'use client'

import { cva } from 'class-variance-authority'
import Image from 'next/image'
import { Section } from '@/components/section'
import { SectionHeader } from '@/components/sections/section-header'
import { Badge } from '@/components/ui/badge'
import { ViewAnimation } from '@/components/view-animation'
import { skills, technologies } from '@/constants/portfolio/skills'

const featureItemVariants = cva(
  'flex flex-col justify-between gap-28 p-6 hover:bg-card/80 sm:gap-34 md:gap-40 lg:gap-46',
  {
    variants: {
      size: {
        sm: '',
        lg: 'lg:col-span-2',
      },
    },
    defaultVariants: {
      size: 'sm',
    },
  }
)

const Skills = () => (
  <Section className='relative w-full pt-10'>
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
              initial={{ opacity: 0 }}
              key={feature.id}
              whileInView={{ opacity: 1 }}
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

        <ViewAnimation
          className='divider-top-dashed px-6 py-6'
          initial={{ opacity: 0, translateY: -6 }}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          <div className='flex flex-wrap gap-2'>
            {technologies.map(({ label, icon, href }) => (
              <Badge
                asChild
                className='gap-2 rounded-md px-3 py-1 text-xs transition-transform will-change-transform hover:-rotate-4 hover:scale-105 sm:text-sm'
                key={label}
                variant='outline'
              >
                <a href={href} rel='noopener noreferrer' target='_blank'>
                  {typeof icon === 'string' ? (
                    <Image
                      alt=''
                      aria-hidden
                      className='size-4'
                      height={16}
                      src={icon}
                      unoptimized
                      width={16}
                    />
                  ) : (
                    <>
                      <Image
                        alt=''
                        aria-hidden
                        className='size-4 dark:hidden'
                        height={16}
                        src={icon.light}
                        unoptimized
                        width={16}
                      />
                      <Image
                        alt=''
                        aria-hidden
                        className='hidden size-4 dark:block'
                        height={16}
                        src={icon.dark}
                        unoptimized
                        width={16}
                      />
                    </>
                  )}
                  {label}
                </a>
              </Badge>
            ))}
          </div>
        </ViewAnimation>
      </div>
    </div>
  </Section>
)
export default Skills
