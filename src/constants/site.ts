import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'

export const title = 'Anirudh Sriram'
// The short mark in the header; the full name stays everywhere else
export const handle = 'an1rudh'
export const description =
  'Design engineer and full-stack developer who designs and builds web apps with Next.js, React, and TypeScript.'
export const owner = 'Anirudh Sriram'

export const baseOptions: BaseLayoutProps = {
  githubUrl: 'https://github.com/techwithanirudh',
  nav: {
    title: handle,
  },
}
