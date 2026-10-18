import type { PagePreview } from '@/lib/page-preview'
import { getPosts, getWorkPages } from '@/lib/source'

const cacheControl =
  'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800'

export function GET(request: Request) {
  const path = new URL(request.url).searchParams.get('path')
  const page = [...getPosts(), ...getWorkPages()].find(
    (entry) => entry.url === path
  )

  if (!page) {
    return Response.json(null, {
      headers: { 'Cache-Control': cacheControl },
      status: 404,
    })
  }

  return Response.json(
    {
      description: page.data.description ?? null,
      image: page.data.image ?? null,
      title: page.data.title ?? 'Untitled',
    } satisfies PagePreview,
    { headers: { 'Cache-Control': cacheControl } }
  )
}
