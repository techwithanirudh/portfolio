import { getStackText } from '../utils/stack'
import { markdownResponse } from '../utils/markdown-response'

export const dynamic = 'force-static'

export function GET() {
  return markdownResponse(getStackText())
}
