export { baseUrl } from './metadata'
export const isProduction = process.env.NODE_ENV === 'production'

export const searchTags = [
  {
    name: 'All',
    value: undefined,
  },
  {
    name: 'Blog',
    value: 'blog',
  },
  {
    name: 'Projects',
    value: 'projects',
  },
]
