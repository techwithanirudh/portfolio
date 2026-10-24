import type { ReactNode } from 'react'
import { Section } from '@/components/layout/sections'
import { SectionHeader } from './header'
import { SectionMoreLink } from './more-link'

interface ListSectionProps {
  children: ReactNode
  description?: ReactNode
  id?: string
  more?: { delay?: number; href: string; label: ReactNode }
  title: ReactNode
}

export const ListSection = ({
  children,
  description,
  id,
  more,
  title,
}: ListSectionProps) => (
  <Section className='relative w-full pt-10' id={id}>
    <div className='flex flex-col gap-10'>
      <SectionHeader
        align='left'
        className='px-6'
        description={description}
        title={title}
      />
      <div>
        {children}
        {more && (
          <SectionMoreLink delay={more.delay} href={more.href}>
            {more.label}
          </SectionMoreLink>
        )}
      </div>
    </div>
  </Section>
)
