import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'
import { githubUrl } from './config/github'

export const owner = 'Anirudh Sriram'
export const title = owner
export const brandName = 'imanirudh'
export const xHandle = 'AnirudhWith'
export const email = 'hello@imanirudh.com'
export const description =
  'Design engineer and full-stack developer building web apps with Next.js, React, and TypeScript.'
export const tagline = 'Design engineer and full-stack developer.'

export const baseOptions: BaseLayoutProps = {
  githubUrl,
  nav: {
    title: brandName,
  },
}
