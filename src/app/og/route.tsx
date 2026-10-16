import { ImageResponse } from '@takumi-rs/image-response'
import { ogCoverSize, ogImageSize, PageImage } from '@/app/og/_lib/template'
import { clampOgParams } from '@/lib/metadata'
import { getCoverDataUrl, getOgFonts } from '@/lib/og'

export const GET = async (
  request: Request
): Promise<ImageResponse | Response> => {
  const { searchParams } = new URL(request.url)
  const rawTitle = searchParams.get('title')

  if (!rawTitle) {
    return new Response('Missing title', { status: 400 })
  }

  const { title, description } = clampOgParams(
    rawTitle,
    searchParams.get('description') ?? undefined
  )

  return new ImageResponse(
    <PageImage
      coverSrc={getCoverDataUrl(title, ogCoverSize)}
      description={description}
      title={title}
    />,
    {
      fonts: await getOgFonts(),
      format: 'webp',
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=31536000, immutable',
      },
      ...ogImageSize,
    }
  )
}
