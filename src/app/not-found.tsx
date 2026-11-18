import { notFoundMetadata } from '@/components/features/not-found/metadata'
import { NotFoundContent } from '@/components/features/not-found/not-found-content'
import { SiteShell } from '@/components/layout/site-shell'

// Catches URLs no route matches, which render outside the (home) layout, so
// this page brings its own shell
export default function NotFound() {
  return (
    <SiteShell>
      <NotFoundContent />
    </SiteShell>
  )
}

export const metadata = notFoundMetadata
