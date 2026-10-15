import type { ReactNode } from 'react'
import { SiteShell } from '@/components/layout/site-shell'

const Layout = ({ children }: { children: ReactNode }) => (
  <SiteShell>{children}</SiteShell>
)

export default Layout
