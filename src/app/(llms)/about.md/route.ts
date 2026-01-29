import { getAboutText, getCommitHistoryText } from '../utils'

export const dynamic = 'force-dynamic'

export async function GET() {
  const commitHistory = await getCommitHistoryText()
  const content = [getAboutText(), commitHistory].filter(Boolean).join('\n').trim()

  return new Response(content, {
    headers: {
      'Content-Type': 'text/markdown;charset=utf-8',
    },
  })
}
