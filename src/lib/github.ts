import { Octokit } from '@octokit/rest'
import { env } from '@/env'

export const owner = 'techwithanirudh'
export const repo = 'minimalistic-portfolio'

export const octokit = new Octokit({
  auth: env.GITHUB_TOKEN,
})
