import { Children, type ReactNode } from 'react'
import { Section } from '@/components/layout/sections'
import { ViewAnimation } from '@/components/view-animation'
import { staggerDelay } from '@/lib/stagger'
import { cn } from '@/lib/utils'

interface HeroProps {
  action?: ReactNode
  caption?: ReactNode
  children?: ReactNode
  className?: string
  description?: ReactNode
  image?: ReactNode
  sectionClassName?: string
  title: ReactNode
}

export const TitleDot = () => <span className='text-primary'>.</span>

export const HeroSection = ({
  action,
  image,
  caption,
  title,
  description,
  children,
  className,
  sectionClassName,
}: HeroProps) => (
  <Section className={cn('px-6 sm:p-4', sectionClassName)}>
    <div
      className={cn(
        'flex flex-col items-start justify-center gap-4 py-6 lg:px-2 lg:py-12',
        className
      )}
    >
      {image && <ViewAnimation>{image}</ViewAnimation>}
      <div className='flex w-full flex-col gap-4'>
        {caption && (
          <ViewAnimation>
            <small className='block text-balance text-muted-foreground text-sm sm:text-base'>
              {caption}
            </small>
          </ViewAnimation>
        )}
        <ViewAnimation
          className={cn(
            action &&
              'flex flex-wrap items-center justify-between gap-x-4 gap-y-3'
          )}
          delay={0.1}
        >
          <h1 className='typography-hero text-balance font-normal text-3xl leading-tight tracking-tighter sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight'>
            {title}
            {typeof title === 'string' && <TitleDot />}
          </h1>
          {action}
        </ViewAnimation>
        {description && (
          <ViewAnimation delay={0.15}>
            <p className='text-pretty text-lg text-muted-foreground leading-relaxed tracking-tight'>
              {description}
            </p>
          </ViewAnimation>
        )}
      </div>
      {/* TODO(slopradar): inconsistent: SectionHeader runs Children.toArray and skips falsy children, this wraps null/false children in an empty ViewAnimation, share one staggered-children helper */}
      {Children.map(children, (child, index) => (
        <ViewAnimation delay={staggerDelay(index, 0.1)}>{child}</ViewAnimation>
      ))}
    </div>
  </Section>
)
