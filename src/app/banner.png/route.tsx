import { ImageResponse } from '@takumi-rs/image-response'
import type { NextRequest } from 'next/server'
import {
  BannerImage,
  ogCoverSize,
  ogCoverTone,
  ogImageSize,
} from '@/app/og/_lib/template'
import { owner, tagline } from '@/constants/site'
import { getCoverDataUrl, getOgFonts, getPortraitDataUrl } from '@/lib/og'

/** `?theme=dark` draws the dark version, for READMEs that swap on color scheme */
export const GET = async (request: NextRequest): Promise<ImageResponse> => {
  const theme =
    request.nextUrl.searchParams.get('theme') === 'dark' ? 'dark' : 'light'
  const fonts = await getOgFonts()

  return new ImageResponse(
    <BannerImage
      coverSrc={getCoverDataUrl(owner, ogCoverSize, ogCoverTone(theme))}
      description={tagline}
      portraitSrc={await getPortraitDataUrl()}
      theme={theme}
      title={owner}
    />,
    { fonts, format: 'png', ...ogImageSize }
  )
}
