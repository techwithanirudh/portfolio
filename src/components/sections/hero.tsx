import { cva, type VariantProps } from 'class-variance-authority'
import { Children, type ReactNode } from 'react'
import { Balancer } from 'react-wrap-balancer'
import { ViewAnimation } from '@/components/view-animation'
import { cn } from '@/lib/utils'
import { Section } from '../section'

const heroVariants = cva('flex flex-col', {
  variants: {
    variant: {
      default:
        'gap-8 py-10 sm:rounded-lg sm:border sm:bg-background sm:px-8 sm:py-20',
      compact: 'gap-4 py-6 lg:py-12 lg:px-2',
    },
    align: {
      center: 'items-start justify-center sm:items-center',
      start: 'items-start justify-center sm:items-start',
      end: 'items-start justify-center sm:items-end',
    },
  },
  defaultVariants: {
    variant: 'default',
    align: 'center',
  },
})

interface HeroProps {
  caption?: string | ReactNode | null
  children?: ReactNode
  className?: string
  description?: string | ReactNode | null
  image?: ReactNode
  sectionClassName?: string
  title: string | ReactNode
}

export const HeroSection = ({
  image,
  caption,
  title,
  description,
  children,
  className,
  sectionClassName,
  variant,
  align,
}: HeroProps &
  VariantProps<typeof heroVariants> & {
    asChild?: boolean
  }) => (
  <Section className={cn('px-6 sm:p-4', sectionClassName)}>
    <div className={cn(heroVariants({ variant, align, className }))}>
      {image && (
        <ViewAnimation
          initial={{ opacity: 0, translateY: -6 }}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          {image}
        </ViewAnimation>
      )}
      <div className='flex flex-col gap-4 sm:items-center'>
        {caption && (
          <ViewAnimation
            initial={{ opacity: 0, translateY: -6 }}
            whileInView={{ opacity: 1, translateY: 0 }}
          >
            <small className='block text-muted-foreground text-sm sm:text-base'>
              {typeof caption === 'string' ? (
                <Balancer>{caption}</Balancer>
              ) : (
                caption
              )}
            </small>
          </ViewAnimation>
        )}
        <ViewAnimation
          delay={0.1}
          initial={{ opacity: 0, translateY: -6 }}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          <h1
            className={cn(
              'typography-hero font-normal text-3xl leading-tight tracking-tighter',
              'sm:text-center sm:text-4xl sm:leading-tight',
              'md:text-5xl md:leading-tight',
              variant === 'compact' && 'text-left sm:text-left'
            )}
          >
            {typeof title === 'string' ? <Balancer>{title}</Balancer> : title}
          </h1>
        </ViewAnimation>
        {description && (
          <ViewAnimation
            delay={0.15}
            initial={{ opacity: 0, translateY: -6 }}
            whileInView={{ opacity: 1, translateY: 0 }}
          >
            <p
              className={cn(
                'text-muted-foreground text-sm sm:text-base',
                variant === 'compact' &&
                  'text-left text-lg leading-relaxed tracking-tight'
              )}
            >
              {typeof description === 'string' ? (
                <Balancer>{description}</Balancer>
              ) : (
                description
              )}
            </p>
          </ViewAnimation>
        )}
      </div>
      {Children.map(children, (child, index) => (
        <ViewAnimation
          delay={0.1 + index * 0.05}
          initial={{ opacity: 0, translateY: -6 }}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          {child}
        </ViewAnimation>
      ))}
    </div>
  </Section>
)
