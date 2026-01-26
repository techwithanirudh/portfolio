import { cva, type VariantProps } from 'class-variance-authority'
import type { ReactNode } from 'react'
import { Section } from '@/components/section'
import {
  SectionHeader,
  type SectionHeaderProps,
} from '@/components/sections/section-header'
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

const splitSectionSidebarVariants = cva('flex flex-col gap-4', {
  variants: {
    background: {
      default: '',
      dashed: 'bg-dashed',
    },
    inset: {
      true: 'px-6 py-8',
      false: '',
    },
  },
  defaultVariants: {
    background: 'default',
    inset: true,
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
  inset,
  className,
}: SplitSectionSidebarProps) => {
  return (
    <div
      className={cn(
        splitSectionSidebarVariants({ background, inset }),
        className
      )}
    >
      {children}
    </div>
  )
}

type SplitSectionHeaderProps = Omit<SectionHeaderProps, 'align'> & {
  align?: SectionHeaderProps['align']
}

export const SplitSectionHeader = ({
  align = 'left',
  ...props
}: SplitSectionHeaderProps) => <SectionHeader align={align} {...props} />

const splitSectionContentVariants = cva('', {
  variants: {
    inset: {
      true: 'px-6 py-8',
      false: '',
    },
  },
  defaultVariants: {
    inset: false,
  },
})

interface SplitSectionContentProps
  extends VariantProps<typeof splitSectionContentVariants> {
  children: ReactNode
  className?: string
}

export const SplitSectionContent = ({
  children,
  inset,
  className,
}: SplitSectionContentProps) => (
  <div className={cn(splitSectionContentVariants({ inset }), className)}>
    {children}
  </div>
)
