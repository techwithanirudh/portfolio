import { HomeLayout } from 'fumadocs-ui/layouts/home'
import type { ReactNode } from 'react'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { LayoutContainer } from '@/components/layout/layout-container'
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
        component: <Header links={linkItems} {...baseOptions} />,
      }}
      slots={{ container: LayoutContainer }}
    >
      {/* Clicking the page focuses this skip-link target; outline-none stops the next key press drawing a ring around the page */}
      <div
        className='relative flex flex-1 flex-col border-border border-dashed outline-none sm:border-b lg:after:pointer-events-none lg:after:sticky lg:after:bottom-0 lg:after:z-10 lg:after:mt-[-3rem] lg:after:h-24 lg:after:select-none lg:after:bg-linear-to-t lg:after:from-background lg:after:to-transparent lg:after:[mask:linear-gradient(to_top,_rgba(0,_0,_0,_1)_0%,_rgba(0,_0,_0,_0)_100%)]'
        id='main-content'
        tabIndex={-1}
      >
        <main className='flex min-h-[calc(100dvh-3.5rem)] flex-col'>
          {/* A `contents` wrapper can't paint borders and hides the sections from a parent
              `divide-y`, so the dividers live here and the last rule is restored */}
          <div className='dashed-stack contents [&>:last-child]:border-b [&>:last-child]:border-dashed'>
            {children}
          </div>
          <PageFill />
        </main>
        <Footer />
      </div>
    </HomeLayout>
  </>
)
