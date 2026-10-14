import { ImageResponse } from '@takumi-rs/image-response'
import { generate } from '@/app/banner.png/og'
import { clampOgParams } from '@/lib/metadata'

export const GET = (request: Request): ImageResponse | Response => {
  const { searchParams } = new URL(request.url)
  const rawTitle = searchParams.get('title')

  if (!rawTitle) {
    return new Response('Missing title', { status: 400 })
  }

  const { title, description } = clampOgParams(
    rawTitle,
    searchParams.get('description') ?? undefined
  )

  return new ImageResponse(generate({ subtitle: description, title }), {
    format: 'webp',
    headers: {
      'Cache-Control': 'public, max-age=86400, s-maxage=31536000, immutable',
    },
    height: 630,
    width: 1200,
  })
}
