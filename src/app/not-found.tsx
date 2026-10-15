import { SiteShell } from '@/components/layout/site-shell'
import NotFound from './(home)/not-found'

// Reached by notFound() outside the site layout (the resume, llms routes);
// everything else lands on app/(home)/not-found.tsx inside the shell already
export { metadata } from './(home)/not-found'

export default function RootNotFound() {
  return (
    <SiteShell>
      <NotFound />
    </SiteShell>
  )
}
