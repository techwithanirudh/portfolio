import { HomeLayout } from 'fumadocs-ui/layouts/home'
import type { ReactNode } from 'react'
import { TextSelectionPopup } from '@/components/features/assistant/text-selection-popup'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { PageFill } from '@/components/layout/page-fill'
import { SkipLink } from '@/components/layout/skip-link'
import { linkItems } from '@/constants/navigation'
import { baseOptions } from '@/constants/site'

// Shared with the root not-found so a 404 outside (home) still looks like the site
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
    >
      <div
        className='relative flex flex-1 flex-col overflow-x-clip px-2 pt-0 lg:after:pointer-events-none lg:after:sticky lg:after:bottom-0 lg:after:z-10 lg:after:-mt-24 lg:after:h-24 lg:after:select-none lg:after:bg-gradient-to-t lg:after:from-background lg:after:to-transparent lg:after:backdrop-blur-sm lg:after:[mask:linear-gradient(to_top,_rgba(0,_0,_0,_1)_0%,_rgba(0,_0,_0,_0)_100%)]'
        id='main-content'
        tabIndex={-1}
      >
        <TextSelectionPopup>{children}</TextSelectionPopup>
        <PageFill fallback />
        <Footer />
      </div>
    </HomeLayout>
  </>
)
