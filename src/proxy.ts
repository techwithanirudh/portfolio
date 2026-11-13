import { type NextRequest, NextResponse } from 'next/server'

const MARKDOWN = 'text/markdown'
const HTML = 'text/html'

/** The q-value of a media type in an Accept header, or 0 when it is absent */
const quality = (accept: string, type: string) => {
  let best = 0
  for (const part of accept.split(',')) {
    const [media = '', ...params] = part.trim().split(';')
    if (media.trim().toLowerCase() !== type) {
      continue
    }
    const q = params
      .map((param) => param.trim().split('='))
      .find(([key]) => key === 'q')?.[1]
    best = Math.max(best, q === undefined ? 1 : Number(q) || 0)
  }
  return best
}

/** Markdown is served when the client asks for it and prefers it to HTML */
const prefersMarkdown = (accept: string | null) => {
  if (!accept) {
    return false
  }
  const markdown = quality(accept, MARKDOWN)
  return markdown > 0 && markdown >= quality(accept, HTML)
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (prefersMarkdown(request.headers.get('accept'))) {
    const response = NextResponse.rewrite(
      new URL(`/md${pathname === '/' ? '' : pathname}`, request.url)
    )
    response.headers.set('Vary', 'Accept')
    return response
  }

  const response = NextResponse.next()
  response.headers.append('Vary', 'Accept')
  return response
}

export const config = {
  // Pages only: not assets, API routes, Next internals or the markdown route itself
  matcher: ['/((?!_next/|api/|md(?:/|$)|.*\\..*).*)'],
}
