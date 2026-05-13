import { Octokit } from '@octokit/rest'
import { unstable_cache } from 'next/cache'

const DEFAULT_REVALIDATE_SECONDS = 60 * 60

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN ?? process.env.GITHUB_ACCESS_TOKEN,
})

export interface GitHubRepoInput {
  branch?: string
  owner: string
  repo: string
}

export interface GitHubRepoDetails extends GitHubRepoInput {
  defaultBranch: string
  description: string | null
  forks: number
  homepage: string | null
  language: string | null
  license: string | null
  name: string
  openIssues: number
  pushedAt: string | null
  stars: number
  topics: string[]
  url: string
  visibility: string
  watchers: number
}

export function parseGitHubRepoInput(input: GitHubRepoInput): GitHubRepoInput {
  const branch = input.branch?.trim()
  const owner = input.owner.trim()
  const repo = input.repo.trim()

  if (!(owner && repo)) {
    throw new Error('GitHub repo requires owner and repo.')
  }

  return { branch: branch || undefined, owner, repo }
}

export const getGitHubRepoUrl = ({
  branch,
  owner,
  repo,
}: GitHubRepoInput): string => {
  const baseUrl = `https://github.com/${owner}/${repo}`

  if (!branch) {
    return baseUrl
  }

  const encodedBranch = branch
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')

  return `${baseUrl}/tree/${encodedBranch}`
}

export const getGitHubRepoDetails = unstable_cache(
  async (input: GitHubRepoInput): Promise<GitHubRepoDetails> => {
    const parsed = parseGitHubRepoInput(input)
    const response = await octokit.repos.get({
      owner: parsed.owner,
      repo: parsed.repo,
    })

    return {
      owner: parsed.owner,
      repo: parsed.repo,
      defaultBranch: response.data.default_branch,
      description: response.data.description,
      branch: parsed.branch,
      forks: response.data.forks_count,
      homepage: response.data.homepage || null,
      language: response.data.language,
      license: response.data.license?.spdx_id ?? null,
      name: response.data.full_name,
      openIssues: response.data.open_issues_count,
      pushedAt: response.data.pushed_at ?? null,
      stars: response.data.stargazers_count,
      topics: response.data.topics ?? [],
      url: parsed.branch
        ? getGitHubRepoUrl(parsed)
        : (response.data.html_url ?? getGitHubRepoUrl(parsed)),
      visibility: response.data.visibility ?? 'public',
      watchers: response.data.watchers_count,
    }
  },
  ['github-repo'],
  { revalidate: DEFAULT_REVALIDATE_SECONDS }
)
