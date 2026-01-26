'use client'

import { cva } from 'class-variance-authority'
import { Icons } from '@/components/icons/icons'
import { Section } from '@/components/section'
import { SectionHeader } from '@/components/sections/section-header'
import { Badge } from '@/components/ui/badge'
import { ViewAnimation } from '@/components/view-animation'
import { skills } from '@/constants/portfolio/skills'

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

const skillTags = [
  { label: 'TypeScript', Icon: Icons.typescript },
  { label: 'JavaScript', Icon: Icons.javascript },
  { label: 'React', Icon: Icons.react },
  { label: 'Next.js', Icon: Icons.nextjs },
  { label: 'Tailwind CSS', Icon: Icons.tailwind },
  { label: 'CSS3', Icon: Icons.css3 },
  { label: 'Node.js', Icon: Icons.nodejs },
  { label: 'Express', Icon: Icons.express },
  { label: 'Git', Icon: Icons.git },
  { label: 'shadcn/ui', Icon: Icons.shadcn },
  { label: 'Hono', Icon: Icons.hono },
  { label: 'Drizzle ORM', Icon: Icons.drizzleOrm },
] as const

const Skills = () => (
  <Section className='relative w-full pt-10'>
    <div className='flex flex-col gap-10'>
      <SectionHeader
        align='left'
        className='px-6'
        description='Focused on building practical projects with modern tools'
        title='My Expertise'
      />

      <div className='w-full border-border border-t border-dashed'>
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

        <ViewAnimation
          className='border-border border-t border-dashed px-6 py-6'
          initial={{ opacity: 0, translateY: -6 }}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          <div className='flex flex-wrap gap-2'>
            {skillTags.map(({ label, Icon }) => (
              <Badge
                className='gap-2 rounded-md px-3 py-1 text-xs transition-transform hover:-rotate-4 hover:scale-105 sm:text-sm'
                key={label}
                variant='outline'
              >
                <Icon aria-hidden='true' className='size-4' />
                {label}
              </Badge>
            ))}
          </div>
        </ViewAnimation>
      </div>
    </div>
  </Section>
)
export default Skills
