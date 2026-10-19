import { projects } from 'fumadocs-mdx:collections/server'
import { loader } from 'fumadocs-core/source'
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server'

export const projectSource = loader(toFumadocsSource(projects, []), {
  baseUrl: '/projects',
})

export const { getPage: getProject, getPages: getProjectPages } = projectSource

export type ProjectPage = ReturnType<typeof getProjectPages>[number]

/**
 * Pinned projects lead, in `order`; everything else follows, newest first.
 */
export const getSortedProjects = () =>
  getProjectPages().toSorted((a, b) => {
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
