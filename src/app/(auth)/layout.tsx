import { HomeLayout } from 'fumadocs-ui/layouts/home'
import type { ReactNode } from 'react'
import { Header } from '@/components/layout/header'
import { linkItems } from '@/constants/navigation'
import { baseOptions } from '@/constants/site'

const Layout = ({ children }: { children: ReactNode }) => (
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
    <main className='relative flex flex-1 flex-col divide-y divide-dashed divide-border border-border border-dashed sm:border-b'>
      {children}
    </main>
  </HomeLayout>
)

export default Layout
