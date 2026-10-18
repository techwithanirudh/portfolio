import { ImageResponse } from '@takumi-rs/image-response'
import { ogCoverSize, ogImageSize, PostImage } from '@/app/og/_lib/template'
import { getPageImage, type OgCollection } from '@/lib/metadata'
import { getCoverDataUrl, getOgFonts, getPortraitDataUrl } from '@/lib/og'
import type { BlogPage, WorkPage } from '@/lib/source'

type OgPage = BlogPage | WorkPage

interface OgRouteOptions<Page extends OgPage> {
  collection: OgCollection
  getPage: (slugs: string[]) => Page | undefined
  getPages: () => Page[]
}

export function createOgRoute<Page extends OgPage>({
  collection,
  getPage,
  getPages,
}: OgRouteOptions<Page>) {
  const GET = async (
    _request: Request,
    context: { params: Promise<{ slug?: string[] }> }
  ): Promise<ImageResponse | Response> => {
    const { slug = [] } = await context.params
    const page = getPage(slug.slice(0, -1))

    if (!page) {
      return new Response('Not Found', { status: 404 })
    }

    const [fonts, portraitSrc] = await Promise.all([
      getOgFonts(),
      getPortraitDataUrl(),
    ])

    return new ImageResponse(
      <PostImage
        coverSrc={getCoverDataUrl(page.slugs.join('/'), ogCoverSize)}
        date={page.data.date}
        portraitSrc={portraitSrc}
        title={page.data.title}
      />,
      { fonts, format: 'webp', ...ogImageSize }
    )
  }

  const generateStaticParams = (): { slug: string[] }[] =>
    getPages().map((page) => ({
      slug: getPageImage(collection, page).segments,
    }))

  return { GET, generateStaticParams }
}
