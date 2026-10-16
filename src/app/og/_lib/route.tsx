import { ImageResponse } from '@takumi-rs/image-response'
import { ogImageSize, PageImage } from '@/app/og/_lib/template'
import { getPageImage, type OgCollection } from '@/lib/metadata'
import { getLocalImageDataUrl } from '@/lib/og'

interface OgPage {
  data: { description?: string; image?: string; title?: string }
  slugs: string[]
}

interface OgRouteOptions<Page extends OgPage> {
  collection: OgCollection
  defaultDescription: string
  getPage: (slugs: string[]) => Page | undefined
  getPages: () => Page[]
  label: string
  withBackgroundImage?: boolean
}

export function createOgRoute<Page extends OgPage>({
  collection,
  defaultDescription,
  getPage,
  getPages,
  label,
  withBackgroundImage = false,
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

    const backgroundImage = withBackgroundImage
      ? await getLocalImageDataUrl(page.data.image)
      : null

    return new ImageResponse(
      <PageImage
        backgroundImage={backgroundImage}
        description={page.data.description || defaultDescription}
        label={label}
        title={page.data.title || 'Untitled'}
      />,
      { format: 'webp', ...ogImageSize }
    )
  }

  const generateStaticParams = (): { slug: string[] }[] =>
    getPages().map((page) => ({
      slug: getPageImage(collection, page).segments,
    }))

  return { GET, generateStaticParams }
}
