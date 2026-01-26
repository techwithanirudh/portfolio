import type { ReactNode } from 'react'
import { Section } from '@/components/section'
import { SectionHeader } from '@/components/sections/section-header'

interface StickySectionProps {
  children: ReactNode
}

export const StickySection = ({ children }: StickySectionProps) => (
  <Section>
    <div className='grid divide-y divide-dashed divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0'>
      {children}
    </div>
  </Section>
)

interface StickySectionSidebarProps {
  children: ReactNode
}

export const StickySectionSidebar = ({
  children,
}: StickySectionSidebarProps) => (
  <div className='bg-dashed'>
    <div className='flex flex-col gap-4 px-6 py-10 sm:sticky sm:top-16 sm:px-8'>
      {children}
    </div>
  </div>
)

interface StickySectionHeaderProps {
  title: string
  description: string
}

export const StickySectionHeader = ({
  title,
  description,
}: StickySectionHeaderProps) => (
  <SectionHeader align='left' description={description} title={title} />
)

interface StickySectionContentProps {
  children: ReactNode
}

export const StickySectionContent = ({
  children,
}: StickySectionContentProps) => <div className='sm:col-span-2'>{children}</div>
