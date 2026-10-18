import { getColophonText } from '../utils'

export const dynamic = 'force-static'
export const revalidate = false

export function GET() {
  return new Response(getColophonText(), {
    headers: {
      'Content-Type': 'text/markdown;charset=utf-8',
    },
  })
}
