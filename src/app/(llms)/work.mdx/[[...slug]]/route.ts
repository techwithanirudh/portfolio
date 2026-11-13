import { createLLMRoute } from '@/app/(llms)/utils/create-llm-route'
import { getProjectLLMText } from '@/lib/get-llm-text'
import { projectSource } from '@/lib/source'

export const dynamic = 'force-static'
export const dynamicParams = false

export const { GET, generateStaticParams } = createLLMRoute(projectSource, getProjectLLMText)
