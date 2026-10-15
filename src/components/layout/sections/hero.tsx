import { Children, type ReactNode } from 'react'
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
}: HeroProps) => (
  <Section className={cn('screen-line-top-none pt-10', sectionClassName)}>
    <div className={cn('flex flex-col', className)}>
      {image && <div className='px-4 pb-4'>{image}</div>}
      {caption && (
        <p className='px-4 pb-3 font-heading font-medium text-muted-foreground text-sm/none tracking-wider'>
          {caption}
        </p>
      )}
      {/* Headers paint as one piece: animating some lines and not others
          reads as jank, and the title is usually the LCP anyway */}
      <h1 className='screen-line-bottom text-balance px-4 pb-3 font-heading font-medium text-4xl tracking-tight'>
        {title}
      </h1>
      {description && (
        <p className='text-balance p-4 text-base text-muted-foreground'>
          {description}
        </p>
      )}
      {Children.count(children) > 0 && (
        <div className='flex flex-wrap items-center gap-2 px-4 pb-4'>
          {Children.map(children, (child) => child)}
        </div>
      )}
    </div>
  </Section>
)
