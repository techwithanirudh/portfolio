import { cva, type VariantProps } from 'class-variance-authority'
import type { ReactNode } from 'react'
import { Section } from '@/components/section'
import { SectionHeader } from '@/components/sections/section-header'
import { cn } from '@/lib/utils'

const splitSectionVariants = cva('grid divide-y divide-dashed divide-border', {
  variants: {
    cols: {
      two: 'sm:grid-cols-2 sm:divide-x sm:divide-y-0',
      three: 'sm:grid-cols-3 sm:divide-x sm:divide-y-0',
    },
  },
  defaultVariants: {
    cols: 'two',
  },
})

const splitSectionSidebarVariants = cva('flex flex-col gap-4 px-6 py-8', {
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
})

interface SplitSectionProps extends VariantProps<typeof splitSectionVariants> {
  children: ReactNode
  className?: string
}

export const SplitSection = ({
  children,
  cols,
  className,
}: SplitSectionProps) => (
  <Section>
    <div className={cn(splitSectionVariants({ cols }), className)}>
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
  return (
    <div
      className={cn(
        splitSectionSidebarVariants({ background, sticky }),
        className
      )}
    >
      {children}
    </div>
  )
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
  <div className={cn('px-6 py-8', className)}>{children}</div>
)
