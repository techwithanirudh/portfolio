import { cva, type VariantProps } from 'class-variance-authority'
import type { ReactNode } from 'react'
import { Section } from '@/components/layout/sections'
import {
  SectionHeader,
  type SectionHeaderProps,
} from '@/components/layout/sections/header'
import { cn } from '@/lib/utils'

// The column is too narrow for side-by-side splits, so the sidebar stacks on
// top and reads as the section header. `cols` stays for older call sites.
const splitSectionVariants = cva('grid', {
  defaultVariants: {
    cols: 'two',
  },
  variants: {
    cols: {
      three: '',
      two: '',
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
      dashed: '',
      default: '',
    },
    inset: {
      false: '',
      true: 'pb-2',
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
      true: 'p-4',
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
