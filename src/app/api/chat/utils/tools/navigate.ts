import { tool } from 'ai'
import { z } from 'zod'
import {
  getSitePages,
  LEADING_HASH,
  type SitePage,
} from '@/app/(llms)/utils/site-pages'
import { baseUrl } from '@/lib/metadata'

export const navigateOutputSchema = z.discriminatedUnion('success', [
  z.object({
    href: z.string(),
    section: z.string().optional(),
    success: z.literal(true),
    title: z.string(),
  }),
  z.object({
    reason: z.string(),
    success: z.literal(false),
    suggestions: z.array(z.string()),
  }),
])

type NavigateOutput = z.infer<typeof navigateOutputSchema>

const TRAILING_SLASHES = /\/+$/
const WORK_PREFIX = /^\/work(?=\/|$)/

const parseTarget = (target: string) => {
  try {
    return new URL(target.trim(), baseUrl)
  } catch {
    return null
  }
}

const toPathAndHash = (parsed: URL) => {
  const path = parsed.pathname.replace(TRAILING_SLASHES, '') || '/'
  return {
    hash: parsed.hash.replace(LEADING_HASH, ''),
    path: path.replace(WORK_PREFIX, '/projects'),
    sameOrigin: parsed.origin === baseUrl.origin,
  }
}

export const parseSitePath = (target: string) => {
  const parsed = parseTarget(target)
  return parsed ? toPathAndHash(parsed) : null
}

const suggest = (pages: SitePage[], path: string) => {
  const needle = path.split('/').filter(Boolean).at(-1)?.toLowerCase() ?? ''
  return pages
    .filter(
      (page) =>
        needle &&
        (page.path.toLowerCase().includes(needle) ||
          page.title.toLowerCase().includes(needle))
    )
    .slice(0, 5)
    .map((page) => page.path)
}

export const resolveNavigation = (target: string): NavigateOutput => {
  const sitePath = parseSitePath(target)
  const pages = getSitePages()

  if (!sitePath) {
    return {
      reason: `${target} is not a valid path.`,
      success: false,
      suggestions: [],
    }
  }

  const { hash, path, sameOrigin } = sitePath

  if (!sameOrigin) {
    return {
      reason: 'Only pages on this site can be opened.',
      success: false,
      suggestions: [],
    }
  }

  const page = pages.find((entry) => entry.path === path)

  if (!page) {
    return {
      reason: `No page at ${path}.`,
      success: false,
      suggestions: suggest(pages, path),
    }
  }

  if (!hash) {
    return { href: page.path, success: true, title: page.title }
  }

  const section = page.sections.find((entry) => entry.id === hash)

  if (!section) {
    return {
      reason: `${page.path} has no #${hash} section.`,
      success: false,
      suggestions: page.sections.map((entry) => `${page.path}#${entry.id}`),
    }
  }

  return {
    href: `${page.path}#${section.id}`,
    section: section.title,
    success: true,
    title: page.title,
  }
}

export const navigateTool = tool({
  description:
    'Take the visitor to a page or a section of this site. The browser navigates as soon as this succeeds. Only call it when the visitor asks to go somewhere or to be shown something.',
  execute: ({ path }) => resolveNavigation(path),
  inputSchema: z.object({
    path: z
      .string()
      .describe(
        'A site path from the site map, optionally with a #section id, like "/about#experience", "/projects/ai_tutor" or "/contact".'
      ),
  }),
  outputSchema: navigateOutputSchema,
})
