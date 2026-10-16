import { ImageResponse } from '@takumi-rs/image-response'
import { BannerImage, ogCoverSize, ogImageSize } from '@/app/og/_lib/template'
import { owner } from '@/constants/site'
import { getCoverDataUrl, getOgFonts, getPortraitDataUrl } from '@/lib/og'

// The hero's opening line: the card has room for one line, and the site
// description runs to two
const tagline = 'Design engineer and full-stack developer.'

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
