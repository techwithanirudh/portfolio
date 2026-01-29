import { getUsesText } from '../utils'

export const dynamic = 'force-static'

export function GET() {
  return new Response(getUsesText(), {
    headers: {
      'Content-Type': 'text/markdown;charset=utf-8',
    },
  })
}
