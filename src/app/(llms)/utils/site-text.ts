import { getCommitHistoryText } from './github-commits'
import { markdownPages } from './markdown-pages'

export async function getSiteText() {
  const commitHistory = await getCommitHistoryText()

  return markdownPages
    .flatMap((page) =>
      page.name === 'about' ? [page.getText(), commitHistory] : [page.getText()]
    )
    .filter(Boolean)
    .join('\n')
}
