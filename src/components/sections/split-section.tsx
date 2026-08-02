import { cva, type VariantProps } from 'class-variance-authority'
import type { ReactNode } from 'react'
import { Section } from '@/components/section'
import {
  SectionHeader,
  type SectionHeaderProps,
} from '@/components/sections/section-header'
import { cn } from '@/lib/utils'

const splitSectionVariants = cva('grid divide-y divide-dashed divide-border', {
  defaultVariants: {
    cols: 'two',
  },
  variants: {
    cols: {
      three: 'lg:grid-cols-3 lg:divide-x lg:divide-y-0',
      two: 'lg:grid-cols-2 lg:divide-x lg:divide-y-0',
    },
  },
})

const splitSectionSidebarVariants = cva('flex flex-col gap-4', {
  defaultVariants: {
    background: 'default',
    inset: true,
  },
  variants: {
    background: {
      dashed: 'bg-dashed',
      default: '',
    },
    inset: {
      false: '',
      true: 'px-6 py-8',
    },
  },
})

interface SplitSectionProps extends VariantProps<typeof splitSectionVariants> {
  children: ReactNode
  className?: string
  id?: string
}

export const SplitSection = ({
  children,
  cols,
  className,
  id,
}: SplitSectionProps) => (
  <Section id={id}>
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
}: SplitSectionSidebarProps) => (
  <div
    className={cn(
      splitSectionSidebarVariants({ background, inset }),
      className
    )}
  >
    {children}
  </div>
)

type SplitSectionHeaderProps = Omit<SectionHeaderProps, 'align'> & {
  align?: SectionHeaderProps['align']
}

export const SplitSectionHeader = ({
  align = 'left',
  ...props
}: SplitSectionHeaderProps) => <SectionHeader align={align} {...props} />

const splitSectionContentVariants = cva('', {
  defaultVariants: {
    inset: false,
  },
  variants: {
    inset: {
      false: '',
      true: 'px-6 py-8',
    },
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
