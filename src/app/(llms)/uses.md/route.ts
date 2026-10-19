import { getUsesText } from '../utils/uses'
import { markdownResponse } from '../utils/markdown-response'

export const dynamic = 'force-static'

export function GET() {
  return markdownResponse(getUsesText())
}
