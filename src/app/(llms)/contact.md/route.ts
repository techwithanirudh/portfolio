import { getContactText } from '../utils'

export const dynamic = 'force-static'
export const revalidate = false

export function GET() {
  return new Response(getContactText(), {
    headers: {
      'Content-Type': 'text/markdown;charset=utf-8',
    },
  })
}
