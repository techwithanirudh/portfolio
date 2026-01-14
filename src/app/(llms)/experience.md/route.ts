import { getExperienceText } from '../utils'

export const dynamic = 'force-static'

export function GET() {
  return new Response(getExperienceText(), {
    headers: {
      'Content-Type': 'text/markdown;charset=utf-8',
    },
  })
}
