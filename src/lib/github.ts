import 'server-only'

import { Octokit } from '@octokit/rest'
import { env } from '@/env'

export const GITHUB_REVALIDATE_SECONDS = 60 * 60

export const octokit = new Octokit({
  auth: env.GITHUB_TOKEN,
})
