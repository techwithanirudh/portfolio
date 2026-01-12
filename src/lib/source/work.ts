import { work } from 'fumadocs-mdx:collections/server'
import { loader } from 'fumadocs-core/source'
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server'

export const workSource = loader(toFumadocsSource(work, []), {
  baseUrl: '/work',
})

export const {
  getPage: getWork,
  getPages: getWorkPages,
  pageTree: workPageTree,
} = workSource

export type WorkPage = ReturnType<typeof getWorkPages>[number]

const workPages = getWorkPages()

export const getSortedByDateWork = () =>
  workPages.toSorted((a, b) => b.data.date.getTime() - a.data.date.getTime())
