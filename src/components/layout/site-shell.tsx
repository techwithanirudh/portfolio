import { HomeLayout } from 'fumadocs-ui/layouts/home'
import type { ReactNode } from 'react'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { PageFill } from '@/components/layout/page-fill'
import { SkipLink } from '@/components/layout/skip-link'
import { linkItems } from '@/constants/navigation'
import { baseOptions } from '@/constants/site'

export const SiteShell = ({ children }: { children: ReactNode }) => (
  <>
    <SkipLink />
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
      <div
        className='relative flex flex-1 flex-col border-border border-dashed sm:border-b lg:after:pointer-events-none lg:after:sticky lg:after:bottom-0 lg:after:z-10 lg:after:mt-[-3rem] lg:after:h-24 lg:after:select-none lg:after:bg-linear-to-t lg:after:from-background lg:after:to-transparent lg:after:[mask:linear-gradient(to_top,_rgba(0,_0,_0,_1)_0%,_rgba(0,_0,_0,_0)_100%)]'
        id='main-content'
        tabIndex={-1}
      >
        <div className='flex min-h-[calc(100dvh-3.5rem)] flex-col'>
          {children}
          <PageFill />
        </div>
        <Footer />
      </div>
    </HomeLayout>
  </>
)
