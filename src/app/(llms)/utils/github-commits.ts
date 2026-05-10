import { getActivityItems } from '@/app/(home)/about/_components/feed/actions'

export const getCommitHistoryText = async () => {
  try {
    const items = await getActivityItems()
    const commitItems = items.flatMap((item) =>
      (item.commits?.length ?? 0) > 0
        ? [
            {
              repoName: item.event.repo?.name ?? 'unknown',
              commits: item.commits ?? [],
            },
          ]
        : []
    )

    if (commitItems.length === 0) {
      return ''
    }

    return `## Recent GitHub Commits\n\n${commitItems
      .map(
        (item) =>
          `### ${item.repoName}\n${item.commits
            .map((commit) => `- ${commit.message} (${commit.sha.slice(0, 7)})`)
            .join('\n')}`
      )
      .join('\n\n')}`
  } catch {
    return ''
  }
}
