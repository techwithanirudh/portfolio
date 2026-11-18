import { tool, type UIMessageStreamWriter } from 'ai'
import { Document, type DocumentData } from 'flexsearch'
import { z } from 'zod'
import {
  type BlogPage,
  blogSource,
  type PageEntry,
  type ProjectPage,
  projectSource,
} from '@/lib/source'

interface SearchDocument extends DocumentData {
  content: string
  description: string
  tag: PageEntry['tag']
  title: string
  url: string
}

const searchServer = createSearchServer()
const WHITESPACE = /\s+/

async function createSearchServer() {
  const search = new Document<SearchDocument>({
    document: {
      id: 'url',
      index: ['title', 'description', 'content'],
      store: true,
      tag: ['tag'],
    },
  })

  const toDocument =
    (tag: SearchDocument['tag']) =>
    async (page: BlogPage | ProjectPage): Promise<SearchDocument> => ({
      content: await page.data.getText('processed'),
      description: page.data.description ?? '',
      tag,
      title: page.data.title,
      url: page.url,
    })

  const [blog, projects] = await Promise.all([
    Promise.all(blogSource.getPages().map(toDocument('blog'))),
    Promise.all(projectSource.getPages().map(toDocument('projects'))),
  ])

  for (const page of [...blog, ...projects]) {
    search.add(page)
  }

  return search
}

export const searchDocsTool = tool({
  contextSchema: z.object({ writer: z.custom<UIMessageStreamWriter>() }),
  description: "Search the site's blog posts and projects.",
  execute: async ({ query, tag, limit }, { context }) => {
    const search = await searchServer
    const results = await search.searchAsync({
      enrich: true,
      limit,
      merge: true,
      query,
      tag: tag === 'all' ? undefined : { tag },
    })
    const terms = query.toLowerCase().split(WHITESPACE).filter(Boolean)

    return results.flatMap(({ doc }, index) => {
      if (!doc) {
        return []
      }
      context.writer.write({
        sourceId: `search-doc-${index}-${doc.url}`,
        title: doc.title,
        type: 'source-url',
        url: doc.url,
      })
      const lower = doc.content.toLowerCase()
      const hit = Math.min(
        ...terms.map((term) => lower.indexOf(term)).filter((at) => at >= 0)
      )
      const start = Number.isFinite(hit) ? Math.max(0, hit - 200) : 0

      return [
        {
          description: doc.description,
          excerpt: doc.content.slice(start, start + 800).trim(),
          tag: doc.tag,
          title: doc.title,
          url: doc.url,
        },
      ]
    })
  },
  inputSchema: z.object({
    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .default(10)
      .describe('Maximum number of results to return (default: 10, max: 100).'),
    query: z.string().describe('The query to search for.'),
    tag: z
      .enum(['all', 'blog', 'projects'])
      .default('all')
      .describe('Limit results to blog posts or projects. Defaults to all.'),
  }),
})
