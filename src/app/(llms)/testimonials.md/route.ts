import { getTestimonialsText } from '../utils/testimonials'
import { markdownResponse } from '../utils/markdown-response'

export const dynamic = 'force-static'

export function GET() {
  return markdownResponse(getTestimonialsText())
}
