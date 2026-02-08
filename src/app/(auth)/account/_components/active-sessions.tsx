import Bowser from 'bowser'
import { format } from 'date-fns'
import { MonitorIcon, SmartphoneIcon, TabletIcon, TvIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { listSessions } from '@/server/auth'

import { RevokeSessionButton } from './revoke-session-button'

type Session = Awaited<ReturnType<typeof listSessions>>[number]

const PLATFORM_ICONS = {
  desktop: MonitorIcon,
  mobile: SmartphoneIcon,
  tablet: TabletIcon,
  tv: TvIcon,
  unknown: MonitorIcon,
} as const

type PlatformType = keyof typeof PLATFORM_ICONS

function parseUserAgent(ua?: string | null): {
  os: string
  browser: string
  browserVersion: string
  platform: PlatformType
} {
  if (!ua) {
    return {
      os: 'Unknown',
      browser: 'Unknown',
      browserVersion: '',
      platform: 'unknown',
    }
  }

  const parsed = Bowser.parse(ua)
  const platformType = parsed.platform.type

  const platform: PlatformType =
    platformType === 'desktop' ||
    platformType === 'mobile' ||
    platformType === 'tablet' ||
    platformType === 'tv'
      ? platformType
      : 'unknown'

  return {
    os: parsed.os.name ?? 'Unknown',
    browser: parsed.browser.name ?? 'Unknown',
    browserVersion: parsed.browser.version ?? '',
    platform,
  }
}

const compareSessionsByRecency =
  (currentToken: string) => (a: Session, b: Session) => {
    const aIsCurrent = a.token === currentToken
    const bIsCurrent = b.token === currentToken

    if (aIsCurrent !== bIsCurrent) {
      return aIsCurrent ? -1 : 1
    }

    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  }

export async function ActiveSessions(props: { currentToken: string }) {
  const { currentToken } = props

  let sessions: Session[]
  try {
    sessions = await listSessions()
  } catch {
    return (
      <Card className='gap-0 rounded-none border-dashed py-0'>
        <div className='p-4 text-muted-foreground text-sm sm:p-6'>
          Could not load sessions.
        </div>
      </Card>
    )
  }

  const sortedSessions = sessions
    .slice()
    .sort(compareSessionsByRecency(currentToken))

  if (sortedSessions.length === 0) {
    return (
      <Card className='rounded-none border-dashed py-12 text-center text-muted-foreground text-sm'>
        No active sessions found.
      </Card>
    )
  }

  return (
    <div className='space-y-4'>
      {sortedSessions.map((session) => (
        <SessionCard
          currentToken={currentToken}
          key={session.id}
          session={session}
        />
      ))}
    </div>
  )
}

function SessionCard(props: { session: Session; currentToken: string }) {
  const { session, currentToken } = props
  const isCurrent = session.token === currentToken
  const parsed = parseUserAgent(session.userAgent)
  const PlatformIcon = PLATFORM_ICONS[parsed.platform]

  const lastActive = format(new Date(session.updatedAt), 'MMM d, yyyy')

  return (
    <Card className='gap-0 rounded-none border-dashed py-0'>
      <div className='flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6'>
        <div className='flex gap-4'>
          <div className='flex size-10 shrink-0 items-center justify-center rounded-md bg-secondary'>
            <PlatformIcon aria-hidden className='size-5' />
          </div>
          <div className='space-y-1'>
            <div className='flex items-center gap-2 font-medium text-sm'>
              <span>{parsed.os}</span>
              {isCurrent ? (
                <Badge className='rounded-none' variant='secondary'>
                  This device
                </Badge>
              ) : null}
            </div>
            <div className='space-y-0.5 text-muted-foreground text-xs'>
              <div>
                {parsed.browser}
                {parsed.browserVersion ? (
                  <span className='ml-1 text-muted-foreground/60'>
                    v{parsed.browserVersion}
                  </span>
                ) : null}
              </div>
              {session.ipAddress ? <div>{session.ipAddress}</div> : null}
              <div>Last active {lastActive}</div>
            </div>
          </div>
        </div>
        <RevokeSessionButton token={session.token} />
      </div>
    </Card>
  )
}
