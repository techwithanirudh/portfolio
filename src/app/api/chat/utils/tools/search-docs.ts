import { tool, type UIMessageStreamWriter } from 'ai'
import { Document } from 'flexsearch'
import { z } from 'zod'
import type { CustomDocument } from '@/app/api/chat/types'
import { post as blogSource, workSource } from '@/lib/source'

const searchServer = createSearchServer()

async function createSearchServer() {
  const search = new Document<CustomDocument>({
    document: {
      id: 'url',
      index: ['title', 'description', 'content'],
      store: true,
      tag: ['tag'],
    },
  })

  const blog = await chunkedAll(
    blogSource.getPages().map(async (page) => {
      if (!('getText' in page.data)) {
        return null
      }

      return {
        content: await page.data.getText('processed'),
        description: page.data.description ?? '',
        tag: 'blog',
        title: page.data.title ?? 'Untitled',
        url: page.url,
      } as CustomDocument
    })
  )

  const work = await chunkedAll(
    workSource.getPages().map(async (page) => {
      if (!('getText' in page.data)) {
        return null
      }

      return {
        content: await page.data.getText('processed'),
        description: page.data.description ?? '',
        tag: 'projects',
        title: page.data.title ?? 'Untitled',
        url: page.url,
      } as CustomDocument
    })
  )

  for (const post of blog) {
    if (post) {
      search.add(post)
    }
  }

  for (const page of work) {
    if (page) {
      search.add(page)
    }
  }

  return search
}

async function chunkedAll<O>(promises: Promise<O>[]): Promise<O[]> {
  const size = 50
  const out: O[] = []

  for (let i = 0; i < promises.length; i += size) {
    out.push(...(await Promise.all(promises.slice(i, i + size))))
  }

  return out
}

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
        .max(100)
        .default(10)
        .describe(
          'Maximum number of results to return (default: 10, max: 100).'
        ),
    }),
    execute: async ({ query, tag: tagParam, limit }) => {
      const tag = tagParam === 'all' ? undefined : tagParam
      const search = await searchServer
      const raw = await search.searchAsync({
        query,
        limit,
        merge: true,
        enrich: true,
        tag: tag ? ({ tag } as Record<string, string>) : undefined,
      })
      const results = raw as Array<{ doc: CustomDocument }>

      for (const [index, result] of results.entries()) {
        writer.write({
          type: 'source-url',
          sourceId: `search-doc-${index}-${result.doc.url}`,
          title: result.doc.title,
          url: result.doc.url,
        })
      }

      return results
    },
  })
