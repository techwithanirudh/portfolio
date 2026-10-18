import {
  getAboutText,
  getCommitHistoryText,
  getProfileFactsText,
} from '../utils'
import { markdownResponse } from '../utils/markdown-response'

export const dynamic = 'force-dynamic'

export async function GET() {
  const commitHistory = await getCommitHistoryText()
  // TODO(slopradar): duplicate-logic: facts, about text and commit history are composed again in utils/site-text.ts and in api/chat get-page-content.ts (which leaves the commits out), export one getAboutPageText() and call it in all three
  const content = [getProfileFactsText(), getAboutText(), commitHistory]
    .filter(Boolean)
    .join('\n')
    .trim()

  return markdownResponse(content)
}
