import { ImageResponse } from '@takumi-rs/image-response'
import { generate } from '@/app/banner.png/og'

export const GET = async (
  request: Request
): Promise<ImageResponse | Response> => {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title')
  const description = searchParams.get('description') ?? undefined

  if (!title) {
    return new Response('Missing title', { status: 400 })
  }

  return new ImageResponse(generate({ title, subtitle: description }), {
    format: 'webp',
    width: 1200,
    height: 630,
  })
}
