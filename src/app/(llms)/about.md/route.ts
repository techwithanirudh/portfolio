import { markdownResponse } from '../utils/markdown-response'
import { getAboutMarkdown } from '../utils/site-path'

export const dynamic = 'force-dynamic'

export async function GET() {
  return markdownResponse(await getAboutMarkdown())
}
