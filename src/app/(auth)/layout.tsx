import { HomeLayout } from 'fumadocs-ui/layouts/home'
import type { ReactNode } from 'react'
import { Header } from '@/components/layout/header'
import { linkItems } from '@/constants/navigation'
import { baseOptions } from '@/constants/site'

// TODO(slopradar): duplicate-logic: copies SiteShell's HomeLayout and Header block, give SiteShell an option for this page's main and footer and use it here
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
    <main className='dashed-stack relative flex flex-1 flex-col border-border border-dashed sm:border-b'>
      {children}
    </main>
  </HomeLayout>
)

export default Layout
