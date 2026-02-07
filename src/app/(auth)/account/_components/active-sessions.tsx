'use client'

import { MonitorIcon, SmartphoneIcon, TabletIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Icons } from '@/components/icons/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { authClient } from '@/lib/auth-client'
import { parseUserAgent } from '@/lib/user-agent'

import { ActiveSessionsSkeleton } from './active-sessions-skeleton'

type Session = NonNullable<
  Awaited<ReturnType<typeof authClient.listSessions>>['data']
>[number]

const PLATFORM_ICONS = {
  desktop: MonitorIcon,
  mobile: SmartphoneIcon,
  tablet: TabletIcon,
  unknown: MonitorIcon,
} as const

export function ActiveSessions({ currentToken }: { currentToken: string }) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [revokingId, setRevokingId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      try {
        const { data, error } = await authClient.listSessions()

        if (cancelled) {
          return
        }
        if (error) {
          toast.error('Failed to load active sessions.')
          setSessions([])
          return
        }

        const sorted = [...(data ?? [])].sort((a, b) => {
          const aIsCurrent = a.token === currentToken
          const bIsCurrent = b.token === currentToken
          if (aIsCurrent !== bIsCurrent) {
            return aIsCurrent ? -1 : 1
          }
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )
        })

        setSessions(sorted)
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    run()

    return () => {
      cancelled = true
    }
  }, [currentToken])

  const handleRevoke = async (token: string) => {
    setRevokingId(token)
    const { error } = await authClient.revokeSession({ token })
    setRevokingId(null)

    if (error) {
      toast.error('Failed to revoke session.')
      return
    }

    toast.success('Session revoked.')

    if (token === currentToken) {
      router.push('/')
      router.refresh()
      return
    }

    setSessions((prev) => prev.filter((s) => s.token !== token))
  }

  if (loading) {
    return <ActiveSessionsSkeleton />
  }

  if (sessions.length === 0) {
    return (
      <Card className='rounded-none border-dashed py-12 text-center text-muted-foreground text-sm'>
        No active sessions found.
      </Card>
    )
  }

  return (
    <div className='space-y-4'>
      {sessions.map((session) => {
        const isCurrent = session.token === currentToken
        const parsed = parseUserAgent(session.userAgent)
        const PlatformIcon = PLATFORM_ICONS[parsed.platform]

        return (
          <Card
            className='gap-0 rounded-none border-dashed py-0'
            key={session.id}
          >
            <div className='flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6'>
              <div className='flex gap-4'>
                <div className='flex size-10 shrink-0 items-center justify-center rounded-md bg-secondary'>
                  <PlatformIcon aria-hidden className='size-5' />
                </div>
                <div className='space-y-1'>
                  <div className='flex items-center gap-2 font-medium text-sm'>
                    <span>{parsed.os}</span>
                    {isCurrent && (
                      <Badge className='rounded-none' variant='secondary'>
                        This device
                      </Badge>
                    )}
                  </div>
                  <div className='space-y-0.5 text-muted-foreground text-xs'>
                    <div>
                      {parsed.browser}
                      {parsed.browserVersion && (
                        <span className='ml-1 text-muted-foreground/60'>
                          v{parsed.browserVersion}
                        </span>
                      )}
                    </div>
                    {session.ipAddress && <div>{session.ipAddress}</div>}
                    <div>
                      Last active{' '}
                      {new Date(session.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <Button
                className='rounded-none'
                disabled={revokingId === session.token}
                onClick={() => handleRevoke(session.token)}
                size='sm'
                variant='destructive'
              >
                {revokingId === session.token && (
                  <Icons.spinner className='size-4 animate-spin' />
                )}
                Revoke
              </Button>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
