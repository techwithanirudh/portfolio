import { getLinkPreviewImage } from '@/lib/link-preview'
import { previewCacheControl } from '../_lib/cache-control'

export function GET(request: Request) {
  const url = new URL(request.url).searchParams.get('url')
  const preview = url ? getLinkPreviewImage(url) : null

  return Response.json(preview, {
    headers: { 'Cache-Control': previewCacheControl },
    status: preview ? 200 : 404,
  })
}
