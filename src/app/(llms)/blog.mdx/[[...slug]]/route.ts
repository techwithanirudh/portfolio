import { createLLMRoute } from '@/app/(llms)/utils/create-llm-route'
import { getBlogLLMText } from '@/lib/get-llm-text'
import { post } from '@/lib/source'

export const dynamic = 'force-static'
export const revalidate = false
export const dynamicParams = false

export const { GET, generateStaticParams } = createLLMRoute(post, getBlogLLMText)
