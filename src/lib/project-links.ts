import type { ProjectPage } from '@/lib/source'

const leadingWww = /^www\./
const edgeSlashes = /^\/|\/$/g

export const hostname = (url: string) =>
  new URL(url).hostname.replace(leadingWww, '')

export const repository = (url: string) =>
  new URL(url).pathname.replace(edgeSlashes, '')

/**
 * A page with a status or platform gets the strip under its lead, which then
 * owns status, platform and the links, so the sidebar leaves them out
 */
export const hasStatusStrip = (page: ProjectPage) =>
  Boolean(page.data.status || page.data.platform)
