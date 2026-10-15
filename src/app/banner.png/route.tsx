import { ImageResponse } from '@takumi-rs/image-response'
import { generate } from '@/app/banner.png/og'
import { ogImageSize } from '@/app/og/_lib/template'

export const GET = (): ImageResponse =>
  new ImageResponse(
    generate({
      subtitle: 'Building web apps and AI experiments',
      title: 'Anirudh',
    }),
    { format: 'png', ...ogImageSize }
  )
