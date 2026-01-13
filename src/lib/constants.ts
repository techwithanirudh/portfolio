import { env } from '@/env'

export { baseUrl } from './metadata'
export const isProduction = env.NODE_ENV === 'production'

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
