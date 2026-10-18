import { notFound } from 'next/navigation'

interface LLMSource<Page> {
  generateParams: () => { slug: string[] }[]
  getPage: (slugs?: string[]) => Page | undefined
}

export function createLLMRoute<Page>(
  source: LLMSource<Page>,
  getText: (page: Page) => Promise<string>
) {
  const GET = async (
    _request: Request,
    context: { params: Promise<{ slug?: string[] }> }
  ) => {
    const { slug } = await context.params
    const page = source.getPage(slug)
    if (!page) {
      notFound()
    }

    return new Response(await getText(page), {
      headers: {
        'Content-Type': 'text/markdown',
      },
    })
  }

  const generateStaticParams = () => source.generateParams()

  return { GET, generateStaticParams }
}
