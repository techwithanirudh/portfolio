import { Octokit } from '@octokit/rest'
import { unstable_cache } from 'next/cache'
import { bundledLanguages, bundledLanguagesAlias } from 'shiki'

const DEFAULT_REVALIDATE_SECONDS = 60 * 60
const SHIKI_LANG_KEYS = new Set([
  ...Object.keys(bundledLanguages),
  ...Object.keys(bundledLanguagesAlias),
])
const LINE_RANGE_REGEX = /#L(\d+)(?:-L(\d+))?$/

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN ?? process.env.GITHUB_ACCESS_TOKEN,
})

export interface ParsedGitHubFileUrl {
  lineRange: {
    startLine?: number
    endLine?: number
  }
  owner: string
  path: string
  ref: string
  repo: string
  source: string
}

const parseLineRange = (
  value?: string
): { startLine?: number; endLine?: number } => {
  if (!value) {
    return {}
  }

  const match = value.match(LINE_RANGE_REGEX)
  if (!match) {
    return {}
  }

  const start = Number(match[1])
  const end = match[2] ? Number(match[2]) : undefined

  return {
    startLine: Number.isNaN(start) ? undefined : start,
    endLine: end !== undefined && !Number.isNaN(end) ? end : undefined,
  }
}

export const parseGitHubURL = (url: string): ParsedGitHubFileUrl => {
  const parsed = new URL(url)
  const lineRange = parseLineRange(parsed.toString())
  parsed.hash = ''

  const segments = parsed.pathname.split('/').filter(Boolean)

  if (parsed.hostname === 'github.com') {
    const [owner, repo, blob, ref, ...pathParts] = segments
    const path = pathParts.join('/')

    if (!(owner && repo) || blob !== 'blob' || !ref || !path) {
      throw new Error(
        'Expected blob URL: https://github.com/{owner}/{repo}/blob/{ref}/{path}'
      )
    }

    return {
      owner,
      repo,
      ref,
      path,
      source: parsed.toString(),
      lineRange,
    }
  }

  if (parsed.hostname === 'raw.githubusercontent.com') {
    const [owner, repo, ref, ...pathParts] = segments
    const path = pathParts.join('/')

    if (!(owner && repo && ref && path)) {
      throw new Error(
        'Expected raw URL: https://raw.githubusercontent.com/{owner}/{repo}/{ref}/{path}'
      )
    }

    return {
      owner,
      repo,
      ref,
      path,
      source: `https://github.com/${owner}/${repo}/blob/${ref}/${path}`,
      lineRange,
    }
  }

  throw new Error(
    'Only github.com and raw.githubusercontent.com URLs are supported.'
  )
}

export const getGitHubFileContent = unstable_cache(
  async (
    parsed: Pick<ParsedGitHubFileUrl, 'owner' | 'repo' | 'ref' | 'path'>
  ): Promise<string> => {
    const response = await octokit.repos.getContent({
      owner: parsed.owner,
      repo: parsed.repo,
      ref: parsed.ref,
      path: parsed.path,
    })

    if (Array.isArray(response.data)) {
      throw new Error('Expected a file path but got a directory response.')
    }

    if (!('content' in response.data && response.data.content)) {
      throw new Error('GitHub API response did not include file content.')
    }

    return Buffer.from(response.data.content, 'base64').toString('utf8')
  },
  ['github-code'],
  { revalidate: DEFAULT_REVALIDATE_SECONDS }
)

export const sliceLines = (
  text: string,
  startLine?: number,
  endLine?: number
): string => {
  const lines = text.replace(/\r/g, '').split('\n')
  const start = Math.max((startLine ?? 1) - 1, 0)
  const end = Math.min(endLine ?? lines.length, lines.length)
  return lines.slice(start, end).join('\n')
}

export const getCodeTitle = (
  path: string,
  startLine?: number,
  endLine?: number
): string => {
  const filename = path.split('/').pop() ?? 'source'

  if (startLine && endLine) {
    return `${filename} (L${startLine}-L${endLine})`
  }

  if (startLine) {
    return `${filename} (from L${startLine})`
  }

  return filename
}

export const resolveLanguage = (path: string, fallback = 'txt'): string => {
  const filename = path.split('/').pop() ?? ''
  const extension = filename.includes('.')
    ? filename.split('.').pop()?.toLowerCase()
    : ''

  if (!extension) {
    return fallback
  }

  const normalized = extension === 'htm' ? 'html' : extension
  return SHIKI_LANG_KEYS.has(normalized) ? normalized : fallback
}
