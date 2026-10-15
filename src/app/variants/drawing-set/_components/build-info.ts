// Adapted from chanhdai.com/src/lib/build-info.ts (MIT, © 2026 Chánh Đại). See ../NOTICES.md
import 'server-only'
import packageJson from '../../../../../package.json'
import { profile } from '../../_shared/profile'

/**
 * Reads the Vercel deployment environment variables, which are server-side
 * only. Do not import this from a client component.
 */

const SHORT_SHA_LENGTH = 7
const SOURCE_URL = `https://github.com/${profile.github}/portfolio`

export type BuildEnvironment = 'production' | 'preview' | 'development'

export interface BuildInfo {
  commitShortSha: string | null
  /** Null while running locally, where HEAD is often unpushed. */
  commitUrl: string | null
  /** YYYY-MM-DD, in the site owner's time zone. */
  date: string
  environment: BuildEnvironment
}

const dateFormatter = new Intl.DateTimeFormat('en-CA', {
  day: '2-digit',
  month: '2-digit',
  timeZone: profile.timeZone,
  year: 'numeric',
})

/** Falls back to the time this module loaded when no build stamp is set. */
const BUILD_DATE = dateFormatter.format(
  process.env.BUILD_TIMESTAMP
    ? new Date(process.env.BUILD_TIMESTAMP)
    : new Date()
)

function resolveEnvironment(): BuildEnvironment {
  const vercelEnv = process.env.VERCEL_ENV
  return vercelEnv === 'production' || vercelEnv === 'preview'
    ? vercelEnv
    : 'development'
}

export function getBuildInfo(): BuildInfo {
  const environment = resolveEnvironment()
  const commitSha = process.env.VERCEL_GIT_COMMIT_SHA

  return {
    commitShortSha: commitSha?.slice(0, SHORT_SHA_LENGTH) ?? null,
    commitUrl:
      commitSha && environment !== 'development'
        ? `${SOURCE_URL}/commit/${commitSha}`
        : null,
    date: BUILD_DATE,
    environment,
  }
}

export const sourceUrl = SOURCE_URL

/** Drops the range prefix, so `^4.3.3` reads as a version. */
const RANGE_PREFIX = /^[^\d]*/

const STACK_DEPENDENCIES = ['next', 'react', 'fumadocs-core', 'tailwindcss']

const declaredVersions: Record<string, string | undefined> = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
}

/** The stack in npm spec form: `["next@16.2.12", …]`. */
export function getStack(): string[] {
  return STACK_DEPENDENCIES.flatMap((dependency) => {
    const version = declaredVersions[dependency]?.replace(RANGE_PREFIX, '')
    return version ? [`${dependency}@${version}`] : []
  })
}
