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
        component: (
          <Header
            links={linkItems}
            {...baseOptions}
            themeSwitch={{ enabled: false }}
          />
        ),
      }}
      slots={{ container: LayoutContainer }}
    >
      {/*
        Clicking the page focuses this skip-link target, and the next key press
        would otherwise draw the browser's ring around the whole page
      */}
      <div
        // TODO(slopradar): utility-sprawl: a 400-character class string with an inline gradient and mask, name it as a utility in globals.css (the bottom fade also appears in layout/header/mobile/index.tsx)
        className='relative flex flex-1 flex-col border-border border-dashed outline-none sm:border-b lg:after:pointer-events-none lg:after:sticky lg:after:bottom-0 lg:after:z-10 lg:after:mt-[-3rem] lg:after:h-24 lg:after:select-none lg:after:bg-linear-to-t lg:after:from-background lg:after:to-transparent lg:after:[mask:linear-gradient(to_top,_rgba(0,_0,_0,_1)_0%,_rgba(0,_0,_0,_0)_100%)]'
        id='main-content'
        tabIndex={-1}
      >
        <main className='flex min-h-[calc(100dvh-3.5rem)] flex-col'>
          {/*
            `contents` keeps this wrapper out of the layout, but it is still a
            DOM child, so a `divide-y` on the column would see one child and
            draw nothing, and a `contents` box cannot paint a border anyway.
            Dividing here puts the separators on the sections themselves.
            `divide-y` skips the last child, so the rule above the footer is
            restored explicitly.
          */}
          <div className='dashed-stack contents [&>:last-child]:border-border [&>:last-child]:border-b [&>:last-child]:border-dashed'>
            {children}
          </div>
          <PageFill />
        </main>
        <Footer />
      </div>
    </HomeLayout>
  </>
)
