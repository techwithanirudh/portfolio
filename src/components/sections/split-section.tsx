import { cva, type VariantProps } from 'class-variance-authority'
import type { ReactNode } from 'react'
import { Section } from '@/components/section'
import { SectionHeader } from '@/components/sections/section-header'
import { cn } from '@/lib/utils'

const splitSectionSidebarVariants = cva(
  'flex flex-col gap-4 px-6 py-10 sm:px-8',
  {
    variants: {
      background: {
        default: '',
        dashed: 'bg-dashed',
      },
      sticky: {
        true: 'sm:sticky sm:top-16',
        false: '',
      },
    },
    defaultVariants: {
      background: 'default',
      sticky: false,
    },
  }
)

interface SplitSectionProps {
  children: ReactNode
}

export const SplitSection = ({ children }: SplitSectionProps) => (
  <Section>
    <div className='grid divide-y divide-dashed divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0'>
      {children}
    </div>
  </Section>
)

interface SplitSectionSidebarProps
  extends VariantProps<typeof splitSectionSidebarVariants> {
  children: ReactNode
  className?: string
}

export const SplitSectionSidebar = ({
  children,
  background,
  sticky,
  className,
}: SplitSectionSidebarProps) => {
  const content = (
    <div className={cn(splitSectionSidebarVariants({ sticky }), className)}>
      {children}
    </div>
  )

  if (background === 'dashed') {
    return <div className='bg-dashed'>{content}</div>
  }

  return content
}

interface SplitSectionHeaderProps {
  title: string
  description: string
}

export const SplitSectionHeader = ({
  title,
  description,
}: SplitSectionHeaderProps) => (
  <SectionHeader align='left' description={description} title={title} />
)

interface SplitSectionContentProps {
  children: ReactNode
  className?: string
}

export const SplitSectionContent = ({
  children,
  className,
}: SplitSectionContentProps) => (
  <div className={cn('sm:col-span-2', className)}>{children}</div>
)
