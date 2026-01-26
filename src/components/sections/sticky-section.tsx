import type { ReactNode } from 'react'
import { Section } from '@/components/section'
import { SectionHeader } from '@/components/sections/section-header'

interface StickySectionRootProps {
  children: ReactNode
}

const Root = ({ children }: StickySectionRootProps) => (
  <Section>
    <div className='grid divide-y divide-dashed divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0'>
      {children}
    </div>
  </Section>
)

interface SidebarProps {
  children: ReactNode
}

const Sidebar = ({ children }: SidebarProps) => (
  <div className='bg-dashed'>
    <div className='flex flex-col gap-4 px-6 py-10 sm:sticky sm:top-16 sm:px-8'>
      {children}
    </div>
  </div>
)

interface HeaderProps {
  title: string
  description: string
}

const Header = ({ title, description }: HeaderProps) => (
  <SectionHeader align='left' description={description} title={title} />
)

interface ContentProps {
  children: ReactNode
}

const Content = ({ children }: ContentProps) => (
  <div className='sm:col-span-2'>{children}</div>
)

export const StickySection = {
  Root,
  Sidebar,
  Header,
  Content,
}
