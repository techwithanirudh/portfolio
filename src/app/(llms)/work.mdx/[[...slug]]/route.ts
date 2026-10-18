import { createLLMRoute } from '@/app/(llms)/utils/create-llm-route'
import { getWorkLLMText } from '@/lib/get-llm-text'
import { workSource } from '@/lib/source'

export const dynamic = 'force-static'
export const dynamicParams = false

export const { GET, generateStaticParams } = createLLMRoute(workSource, getWorkLLMText)
