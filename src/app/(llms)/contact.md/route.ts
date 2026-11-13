import { getContactText } from '../utils/contact'
import { markdownResponse } from '../utils/markdown-response'

export const dynamic = 'force-static'

export function GET() {
  return markdownResponse(getContactText())
}
