import { createLLMRoute } from '@/app/(llms)/utils/create-llm-route'
import { getBlogLLMText } from '@/lib/get-llm-text'
import { blogSource } from '@/lib/source'

export const dynamic = 'force-static'
export const dynamicParams = false

export const { GET, generateStaticParams } = createLLMRoute(blogSource, getBlogLLMText)
