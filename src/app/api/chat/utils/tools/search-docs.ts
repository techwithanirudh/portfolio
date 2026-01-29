import { tool, type UIMessageStreamWriter } from 'ai'
import { initAdvancedSearch } from 'fumadocs-core/search/server'
import { z } from 'zod'
import { getPosts, getWorkPages } from '@/lib/source'

const pagesByUrl = new Map<
  string,
  {
    title?: string
    description?: string
  }
>()

const server = initAdvancedSearch({
  language: 'english',
  indexes: () => {
    const blogPages = getPosts()
    const workPages = getWorkPages()

    for (const page of blogPages) {
      pagesByUrl.set(page.url, {
        title: page.data.title,
        description: page.data.description,
      })
    }

    for (const page of workPages) {
      pagesByUrl.set(page.url, {
        title: page.data.title,
        description: page.data.description,
      })
    }

    return [
      ...blogPages.map((page) => ({
        id: page.url,
        title: page.data.title ?? 'Untitled',
        description: page.data.description,
        structuredData: page.data.structuredData,
        url: page.url,
        tag: 'blog',
      })),
      ...workPages.map((page) => ({
        id: page.url,
        title: page.data.title ?? 'Untitled',
        description: page.data.description,
        structuredData: page.data.structuredData,
        url: page.url,
        tag: 'projects',
      })),
    ]
  },
})

const Tag = z.union([
  z.literal('all'),
  z.literal('blog'),
  z.literal('projects'),
])

export const createSearchDocsTool = (writer: UIMessageStreamWriter) =>
  tool({
    description:
      'Search the portfolio content using the internal search server.',
    inputSchema: z.object({
      query: z.string().describe('The query to search for.'),
      tag: Tag.default('all').describe('Optional tag filter.'),
      locale: z
        .string()
        .optional()
        .describe('Optional locale for i18n setups.'),
      limit: z
        .number()
        .int()
        .min(1)
        .max(50)
        .default(10)
        .describe(
          'Maximum number of results to return (default: 10, max: 50).'
        ),
    }),
    execute: async ({ query, tag: tagParam, locale, limit }) => {
      const tag = tagParam === 'all' ? undefined : tagParam
      const results = await server.search(query, {
        tag,
        locale,
      })

      const seen = new Set<string>()
      const deduped = results.filter((result) => {
        if (!result.url || seen.has(result.url)) {
          return false
        }
        seen.add(result.url)
        return true
      })

      const trimmed = deduped.slice(0, limit).map((doc) => {
        const pageInfo = pagesByUrl.get(doc.url)

        return {
          ...doc,
          pageTitle: pageInfo?.title,
          pageDescription: pageInfo?.description,
        }
      })

      trimmed.forEach((doc, index) => {
        const title = doc.pageTitle ?? doc.url
        writer.write({
          type: 'source-url',
          sourceId: `search-doc-${index}-${doc.url}`,
          url: doc.url,
          title,
        })
      })

      if (trimmed.length === 0) {
        return `No content found for query "${query}".`
      }

      const summary = trimmed
        .map((doc, index) => {
          const title = doc.pageTitle ?? doc.url
          const description = doc.pageDescription
            ? ` — ${doc.pageDescription}`
            : ''
          return `${index + 1}. ${title} (${doc.url})${description}`
        })
        .join('\n')

      return `Found ${trimmed.length} pages for "${query}":\n${summary}`
    },
  })
