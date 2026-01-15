'use client'

import { cva } from 'class-variance-authority'
import { Section } from '@/components/section'
import { ViewAnimation } from '@/components/view-animation'
import { skills } from '@/constants/portfolio/skills'

// Create a variant for feature items
const featureItemVariants = cva(
  'group flex flex-col justify-between gap-10 p-6 hover:bg-card hover:bg-card/80 sm:gap-22 md:gap-34 lg:gap-46',
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
      <ViewAnimation
        className='flex flex-col gap-2 px-6'
        initial={{ opacity: 0, translateY: -6 }}
        whileInView={{ opacity: 1, translateY: 0 }}
      >
        <h2 className='typography-title text-left font-regular text-3xl tracking-tighter md:text-5xl'>
          My Expertise
        </h2>
        <p className='typography-body text-left text-lg text-muted-foreground leading-relaxed tracking-tight'>
          Focused on building practical projects with modern tools
        </p>
      </ViewAnimation>

      <div className='w-full space-y-4 border-border border-t border-dashed'>
        <div className='grid grid-cols-1 divide-x divide-dashed divide-border text-left sm:grid-cols-2 lg:grid-cols-3 [&>*:last-child]:border-b-0 sm:[&>*:nth-last-child(-n+2)]:border-b-0 lg:[&>*:nth-last-child(-n+3)]:border-b-0 [&>*]:border-border [&>*]:border-b [&>*]:border-dashed'>
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
              <feature.Icon className='h-8 w-8 stroke-1 transition-transform hover:rotate-12 hover:scale-125' />
              <div className='flex flex-col'>
                <h3 className='text-xl tracking-tight transition-all'>
                  {feature.title}
                </h3>
                <p className='max-w-xs text-base text-muted-foreground transition-all'>
                  {feature.description}
                </p>
              </div>
            </ViewAnimation>
          ))}
        </div>
      </div>
    </div>
  </Section>
)
export default Skills
