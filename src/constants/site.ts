import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'
import { githubUrl } from './config/github'

export const owner = 'Anirudh Sriram'
export const title = owner
// TODO(slopradar): unclear-name: `handle` here ('imanirudh', used as the nav title) competes with profile.handle ('an1rudh') and xHandle, name it navTitle or brandName
export const handle = 'imanirudh'
export const xHandle = 'AnirudhWith'
export const email = 'hello@imanirudh.com'
export const description =
  'Design engineer and full-stack developer who designs and builds web apps with Next.js, React, and TypeScript.'
export const tagline = 'Design engineer and full-stack developer.'

export const baseOptions: BaseLayoutProps = {
  githubUrl,
  nav: {
    title: handle,
  },
}
