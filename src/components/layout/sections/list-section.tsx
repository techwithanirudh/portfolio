import type { ReactNode } from 'react'
import { SectionHeader } from './header'
import { Section } from './index'
import { SectionMoreLink } from './more-link'

interface ListSectionProps {
  children: ReactNode
  description?: ReactNode
  id?: string
  more?: { delay?: number; href: string; label: ReactNode }
  title: ReactNode
}

// A left aligned section header over a full width list, with an optional
// "view all" link closing it off
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
