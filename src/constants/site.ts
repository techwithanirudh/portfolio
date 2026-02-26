import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'

export const baseTitle = 'Anirudh Sriram'
export const oiiaTitle = 'OIIA'
export const title = baseTitle
export const description =
  'Design engineer and full-stack developer who blends design and code to build beautiful, functional websites.'
export const baseOwner = 'Anirudh Sriram'
export const oiiaOwner = 'OIIA'
export const owner = baseOwner

export const getSiteTitle = (mode: 'default' | 'oiia') =>
  mode === 'oiia' ? oiiaTitle : baseTitle
export const getSiteOwner = (mode: 'default' | 'oiia') =>
  mode === 'oiia' ? oiiaOwner : baseOwner

export const baseOptions: BaseLayoutProps = {
  nav: {
    title,
  },
  githubUrl: 'https://github.com/techwithanirudh',
}
