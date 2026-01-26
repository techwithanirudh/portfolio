import type { ReactNode } from 'react'
import { Section } from '@/components/section'
import { SectionHeader } from '@/components/sections/section-header'

interface StickySectionProps {
  title: string
  description: string
  children: ReactNode
  sidebarContent?: ReactNode
}

export const StickySection = ({
  title,
  description,
  children,
  sidebarContent,
}: StickySectionProps) => (
  <Section>
    <div className='grid divide-y divide-dashed divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0'>
      <div className='bg-dashed'>
        <div className='flex flex-col gap-4 px-6 py-10 sm:sticky sm:top-16 sm:px-8'>
          <SectionHeader align='left' description={description} title={title} />
          {sidebarContent}
        </div>
      </div>
      <div className='sm:col-span-2'>{children}</div>
    </div>
  </Section>
)
