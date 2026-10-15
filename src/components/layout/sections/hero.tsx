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

// Page heading after chanhdai.com's PageHeading (MIT, (c) Chanh Dai): a small
// tagline, a big title between full-width lines, then the description.
export const HeroSection = ({
  image,
  caption,
  title,
  description,
  children,
  className,
  sectionClassName,
}: HeroProps & {
  /** Kept for older call sites, every page heading is left aligned now. */
  align?: 'center' | 'start' | 'end' | null
  /** Kept for older call sites. */
  variant?: 'default' | 'compact' | null
}) => (
  <Section className={cn('screen-line-top-none pt-10', sectionClassName)}>
    <div className={cn('flex flex-col', className)}>
      {image && <div className='px-4 pb-4'>{image}</div>}
      {caption && (
        <ViewAnimation
          initial={{ opacity: 0, translateY: -6 }}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          <p className='px-4 pb-3 font-heading font-medium text-muted-foreground text-sm/none tracking-wider'>
            {caption}
          </p>
        </ViewAnimation>
      )}
      <ViewAnimation
        delay={0.05}
        initial={{ opacity: 0, translateY: -6 }}
        whileInView={{ opacity: 1, translateY: 0 }}
      >
        <h1 className='screen-line-bottom text-balance px-4 font-heading font-medium text-4xl tracking-tight'>
          {title}
        </h1>
      </ViewAnimation>
      {description && (
        <ViewAnimation
          delay={0.1}
          initial={{ opacity: 0, translateY: -6 }}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          <p className='text-balance p-4 text-base text-muted-foreground'>
            {description}
          </p>
        </ViewAnimation>
      )}
      {Children.count(children) > 0 && (
        <div className='flex flex-wrap items-center gap-2 px-4 pb-4'>
          {Children.map(children, (child) => child)}
        </div>
      )}
    </div>
  </Section>
)
