import { ImageResponse } from '@takumi-rs/image-response'
import { BannerImage, ogCoverSize, ogImageSize } from '@/app/og/_lib/template'
import { owner, tagline } from '@/constants/site'
import { getCoverDataUrl, getOgFonts, getPortraitDataUrl } from '@/lib/og'

export const GET = async (): Promise<ImageResponse> => {
  const [fonts, portraitSrc] = await Promise.all([
    getOgFonts(),
    getPortraitDataUrl(),
  ])

  return new ImageResponse(
    <BannerImage
      coverSrc={getCoverDataUrl(owner, ogCoverSize)}
      description={tagline}
      portraitSrc={portraitSrc}
      title={owner}
    />,
    { fonts, format: 'png', ...ogImageSize }
  )
}
