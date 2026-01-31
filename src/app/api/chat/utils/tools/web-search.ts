import { webSearch } from '@exalabs/ai-sdk'

export const webSearchTool = webSearch({
  numResults: 5,
  maxCharacters: 2000,
})
