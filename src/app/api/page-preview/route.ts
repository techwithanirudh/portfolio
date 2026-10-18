import type { PagePreview } from '@/lib/page-preview'
import { getPosts, getWorkPages } from '@/lib/source'
import { previewCacheControl } from '../_lib/cache-control'

export function GET(request: Request) {
  const path = new URL(request.url).searchParams.get('path')
  const page = [...getPosts(), ...getWorkPages()].find(
    (entry) => entry.url === path
  )

  if (!page) {
    return Response.json(null, {
      headers: { 'Cache-Control': previewCacheControl },
      status: 404,
    })
  }

  return Response.json(
    {
      description: page.data.description ?? null,
      image: page.data.image ?? null,
      title: page.data.title,
    } satisfies PagePreview,
    { headers: { 'Cache-Control': previewCacheControl } }
  )
}
