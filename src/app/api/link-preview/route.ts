import { getLinkPreview, type LinkPreviewImage } from '@/lib/link-preview'

const cacheControl =
  'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800'

export function GET(request: Request) {
  const url = new URL(request.url).searchParams.get('url')
  const preview = url ? getLinkPreview(url) : null

  if (!preview) {
    return Response.json(null, {
      headers: { 'Cache-Control': cacheControl },
      status: 404,
    })
  }

  const { height, screenshotPath, width } = preview
  return Response.json(
    { height, screenshotPath, width } satisfies LinkPreviewImage,
    { headers: { 'Cache-Control': cacheControl } }
  )
}
