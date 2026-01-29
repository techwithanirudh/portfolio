import { getGuestbookText } from '../utils'

export const dynamic = 'force-dynamic'

export async function GET() {
  return new Response(await getGuestbookText(), {
    headers: {
      'Content-Type': 'text/markdown;charset=utf-8',
    },
  })
}
