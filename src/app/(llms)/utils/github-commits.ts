// TODO(slopradar): misplaced-module: llms reaches into a route's _components for the GitHub fetch, move feed/data.ts to src/lib (for example src/lib/github-activity.ts)
import { getActivityItems } from '@/app/(home)/about/_components/feed/data'

export const getCommitHistoryText = async () => {
  const items = await getActivityItems()
  const commitItems = items.flatMap((item) =>
    item.commits?.length
      ? [
          {
            commits: item.commits,
            repoName: item.event.repo?.name ?? 'unknown',
          },
        ]
      : []
  )

  if (commitItems.length === 0) {
    return ''
  }

  return `## Recent GitHub commits\n\n${commitItems
    .map(
      (item) =>
        `### ${item.repoName}\n${item.commits
          .map((commit) => `- ${commit.message} (${commit.sha.slice(0, 7)})`)
          .join('\n')}`
    )
    .join('\n\n')}`
}
