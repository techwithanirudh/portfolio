import { getColophonText } from '../utils/colophon'
import { markdownResponse } from '../utils/markdown-response'

export const dynamic = 'force-static'

export function GET() {
  return markdownResponse(getColophonText())
}
