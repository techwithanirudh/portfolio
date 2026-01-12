'use client'

import { cva } from 'class-variance-authority'
import { BrainCircuitIcon, Code2Icon, LayersIcon } from 'lucide-react'
import { Section } from '@/components/section'
import { ViewAnimation } from '@/components/view-animation'

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

const features = [
  {
    id: 1,
    Icon: Code2Icon,
    title: 'Web Development',
    description:
      'Building modern web apps with Next.js, React, TypeScript, and UI frameworks.',
    size: 'sm',
  },
  {
    id: 2,
    Icon: BrainCircuitIcon,
    title: 'AI & Machine Learning',
    description:
      'Building AI features with Python, OpenCV, and GPT-powered applications.',
    size: 'sm',
  },
  {
    id: 3,
    Icon: LayersIcon,
    title: 'Full Stack Development',
    description:
      'Creating end-to-end solutions with Node.js, Python, databases, and cloud technologies.',
    size: 'sm',
  },
]

const Skills = () => (
  <Section className='relative w-full pt-10'>
    <div className='flex flex-col gap-10'>
      <ViewAnimation
        className='flex flex-col gap-2 px-6'
        initial={{ opacity: 0, translateY: -8 }}
        whileInView={{ opacity: 1, translateY: 0 }}
      >
        <h2 className='max-w-xl text-left font-regular text-3xl tracking-tighter md:text-5xl'>
          My Expertise
        </h2>
        <p className='max-w-xl text-left text-lg text-muted-foreground leading-relaxed tracking-tight lg:max-w-lg'>
          Focused on building practical web and AI projects with modern tools
        </p>
      </ViewAnimation>

      <div className='w-full space-y-4 border-border border-t border-dashed'>
        <div className='grid grid-cols-1 divide-x divide-dashed divide-border text-left sm:grid-cols-2 lg:grid-cols-3 [&>*]:border-b [&>*]:border-border [&>*]:border-dashed [&>*:last-child]:border-b-0 sm:[&>*:nth-last-child(-n+2)]:border-b-0 lg:[&>*:nth-last-child(-n+3)]:border-b-0'>
          {features.map((feature, index) => (
            <ViewAnimation
              className={featureItemVariants({
                size: feature.size as 'sm' | 'lg',
              })}
              delay={0.6 + index * 0.1}
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
