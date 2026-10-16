import { Children, type ReactNode } from 'react'
import { ViewAnimation } from '@/components/view-animation'
import { cn } from '@/lib/utils'
import { Section } from './index'

interface HeroProps {
  caption?: string | ReactNode | null
  children?: ReactNode
  className?: string
  description?: string | ReactNode | null
  image?: ReactNode
  sectionClassName?: string
  title: string | ReactNode
}

// The blue full stop that ends page titles, like the home hero's name
export const TitleDot = () => <span className='text-primary'>.</span>

// The one page header: a plain left aligned title with the description under
// it. Plain string titles get the blue full stop on their own.
export const HeroSection = ({
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
        <ViewAnimation delay={0.1}>
          <h1 className='typography-hero text-balance font-normal text-3xl leading-tight tracking-tighter sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight'>
            {title}
            {typeof title === 'string' && <TitleDot />}
          </h1>
        </ViewAnimation>
        {description && (
          <ViewAnimation delay={0.15}>
            <p className='text-pretty text-lg text-muted-foreground leading-relaxed tracking-tight'>
              {description}
            </p>
          </ViewAnimation>
        )}
      </div>
      {Children.map(children, (child, index) => (
        <ViewAnimation delay={0.1 + index * 0.05}>{child}</ViewAnimation>
      ))}
    </div>
  </Section>
)
