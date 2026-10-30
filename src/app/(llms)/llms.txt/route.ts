import { getLlmsIndexText } from '../utils/llms-index'

const content = getLlmsIndexText()

export const dynamic = 'force-static'

export function GET() {
  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
  })
}
