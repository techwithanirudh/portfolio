import { tool, type UIMessageStreamWriter } from 'ai'
import { Document } from 'flexsearch'
import { z } from 'zod'
import type { CustomDocument } from '@/lib/ai/chat/types'
import {
  type BlogPage,
  post as blogSource,
  type WorkPage,
  workSource,
} from '@/lib/source'

// TODO(slopradar): library-exists: a second FlexSearch index over the same pages duplicates api/search/route.ts, query the fumadocs createSearchAPI server (its search method) instead
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

  const toDocument =
    (tag: CustomDocument['tag']) =>
    async (page: BlogPage | WorkPage): Promise<CustomDocument> => ({
      content: await page.data.getText('processed'),
      description: page.data.description ?? '',
      tag,
      title: page.data.title,
      url: page.url,
    })

  const [blog, work] = await Promise.all([
    Promise.all(blogSource.getPages().map(toDocument('blog'))),
    Promise.all(workSource.getPages().map(toDocument('projects'))),
  ])

  for (const page of [...blog, ...work]) {
    search.add(page)
  }

  return search
}

const Tag = z.enum(['all', 'blog', 'projects'])

export const createSearchDocsTool = (writer: UIMessageStreamWriter) =>
  tool({
    description:
      'Search the portfolio content using the internal search server.',
    execute: async ({ query, tag: tagParam, limit }) => {
      const tag = tagParam === 'all' ? undefined : tagParam
      const search = await searchServer
      const results = await search.searchAsync({
        enrich: true,
        limit,
        merge: true,
        query,
        tag: tag ? { tag } : undefined,
      })

      for (const [index, { doc }] of results.entries()) {
        if (doc) {
          writer.write({
            sourceId: `search-doc-${index}-${doc.url}`,
            title: doc.title,
            type: 'source-url',
            url: doc.url,
          })
        }
      }

      // TODO(slopradar): ai-sdk: tool-output: every hit carries its full page text (store: true plus enrich), so the model reads whole posts that getPageContent exists to fetch, return { title, url, description } per hit or shape it with toModelOutput
      return results
    },
    inputSchema: z.object({
      limit: z
        .number()
        .int()
        .min(1)
        .max(100)
        .default(10)
        .describe(
          'Maximum number of results to return (default: 10, max: 100).'
        ),
      query: z.string().describe('The query to search for.'),
      tag: Tag.default('all').describe('Optional tag filter.'),
    }),
  })
