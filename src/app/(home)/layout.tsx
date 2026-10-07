import type { ReactNode } from 'react'
import { TextSelectionPopup } from '@/components/features/assistant/text-selection-popup'
import { SiteShell } from '@/components/layout/site-shell'

const Layout = ({ children }: { children: ReactNode }) => (
  <SiteShell>
    <TextSelectionPopup>{children}</TextSelectionPopup>
  </SiteShell>
)

export default Layout
