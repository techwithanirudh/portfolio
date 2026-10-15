import { SiteShell } from '@/components/layout/site-shell'
import NotFound from './(home)/not-found'

// Only notFound() outside the site layout (resume, llms) lands here
export { metadata } from './(home)/not-found'

export default function RootNotFound() {
  return (
    <SiteShell>
      <NotFound />
    </SiteShell>
  )
}
