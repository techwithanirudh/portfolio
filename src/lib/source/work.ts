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

/**
 * Pinned projects lead, in `order`; everything else follows, newest first.
 */
export const getSortedWork = () =>
  workPages.toSorted((a, b) => {
    const aOrder = a.data.order
    const bOrder = b.data.order

    if (aOrder !== undefined && bOrder !== undefined) {
      return aOrder - bOrder
    }
    if (aOrder !== undefined) {
      return -1
    }
    if (bOrder !== undefined) {
      return 1
    }

    return b.data.date.getTime() - a.data.date.getTime()
  })
