import { getLinkPreviewImage } from '@/lib/link-preview'

const cacheControl =
  'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800'

export function GET(request: Request) {
  const url = new URL(request.url).searchParams.get('url')
  const preview = url ? getLinkPreviewImage(url) : null

  return Response.json(preview, {
    headers: { 'Cache-Control': cacheControl },
    status: preview ? 200 : 404,
  })
}
