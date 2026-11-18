import { z } from 'zod'
import { getBlogLLMText, getProjectLLMText } from '@/lib/get-llm-text'
import { baseUrl } from '@/lib/metadata'
import { blogSource, projectSource } from '@/lib/source'
import { getAboutText } from './about'
import { getCommitHistoryText } from './github-commits'
import { markdownPages } from './markdown-pages'
import { getProfileFactsText } from './profile'
import { getSitePages, LEADING_HASH, type SitePage } from './site-pages'

const TRAILING_SLASHES = /\/+$/
const WORK_PREFIX = /^\/work(?=\/|$)/

/** A path or URL on this site, with the old /work paths read as /projects */
export const parseSitePath = (target: string) => {
  let parsed: URL
  try {
    parsed = new URL(target.trim(), baseUrl)
  } catch {
    return null
  }

  const path = (parsed.pathname.replace(TRAILING_SLASHES, '') || '/').replace(
    WORK_PREFIX,
    '/projects'
  )
  return {
    hash: parsed.hash.replace(LEADING_HASH, ''),
    path,
    sameOrigin: parsed.origin === baseUrl.origin,
    segments: path.split('/').filter(Boolean),
  }
}

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

/** The site page (and section) a path names, or why there is none */
export const resolveNavigation = (
  target: string
): z.infer<typeof navigateOutputSchema> => {
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

export const getAboutMarkdown = async () =>
  [getProfileFactsText(), getAboutText(), await getCommitHistoryText()]
    .filter(Boolean)
    .join('\n')
    .trim()

/** The markdown the .md or .mdx route serves for a site path like "about" or "blog/hello-world" */
export const getPageMarkdown = async (target: string) => {
  const [section, ...slugs] = parseSitePath(target)?.segments ?? []

  if (section === 'blog') {
    const page = blogSource.getPage(slugs)
    return page && (await getBlogLLMText(page))
  }

  if (section === 'projects') {
    const page = projectSource.getPage(slugs)
    return page && (await getProjectLLMText(page))
  }

  if (!section || slugs.length > 0) {
    return
  }

  if (section === 'about') {
    return await getAboutMarkdown()
  }

  return markdownPages.find((page) => page.name === section)?.getText()
}
