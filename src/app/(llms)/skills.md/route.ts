import { getSkillsText } from '../utils'

export const dynamic = 'force-static'

export function GET() {
  return new Response(getSkillsText(), {
    headers: {
      'Content-Type': 'text/markdown;charset=utf-8',
    },
  })
}
