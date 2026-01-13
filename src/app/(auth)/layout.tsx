import { HomeLayout } from 'fumadocs-ui/layouts/home'
import type { ReactNode } from 'react'
import { Header } from '@/components/sections/header'
import { baseOptions, linkItems } from '../layout.shared'

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <HomeLayout
      {...baseOptions}
      className='pt-0'
      links={linkItems}
      nav={{
        component: (
          <Header
            links={linkItems}
            {...baseOptions}
            themeSwitch={{ enabled: false }}
          />
        ),
      }}
    >
      <main className='container relative mx-auto flex min-h-full flex-1 items-center justify-center self-center border-border border-x border-b border-dashed'>
        {children}
      </main>
    </HomeLayout>
  )
}

export default Layout
