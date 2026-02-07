'use client'

import { MonitorIcon, SmartphoneIcon, TabletIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Icons } from '@/components/icons/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { authClient } from '@/lib/auth-client'

interface Session {
  id: string
  token: string
  createdAt: Date
  updatedAt: Date
  expiresAt: Date
  ipAddress?: string | null
  userAgent?: string | null
}

export function ActiveSessions({ currentToken }: { currentToken: string }) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [revokingId, setRevokingId] = useState<string | null>(null)

  useEffect(() => {
    authClient.listSessions().then(({ data }) => {
      if (data) {
        const sorted = [...data].sort((a, b) => {
          const aIsCurrent = a.token === currentToken
          const bIsCurrent = b.token === currentToken
          if (aIsCurrent !== bIsCurrent) {
            return aIsCurrent ? -1 : 1
          }
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        })
        setSessions(sorted)
      }
      setLoading(false)
    })
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
      window.location.reload()
      return
    }

    setSessions((prev) => prev.filter((s) => s.token !== token))
  }

  if (loading) {
    return (
      <div className='space-y-4'>
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton className='h-24 w-full rounded-none' key={i} />
        ))}
      </div>
    )
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
        const PlatformIcon = parsed.icon

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

function parseUserAgent(ua?: string | null) {
  if (!ua) {
    return { os: 'Unknown', browser: 'Unknown', browserVersion: '', icon: MonitorIcon }
  }

  let os = 'Unknown'
  if (/android/i.test(ua)) os = 'Android'
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS'
  else if (/mac\s?os|macintosh/i.test(ua)) os = 'macOS'
  else if (/windows/i.test(ua)) os = 'Windows'
  else if (/linux/i.test(ua)) os = 'Linux'
  else if (/cros/i.test(ua)) os = 'ChromeOS'

  let browser = 'Unknown'
  let browserVersion = ''

  const edgeMatch = ua.match(/edg(?:e|a|ios)?\/(\d+[\d.]*)/i)
  const chromeMatch = ua.match(/chrom(?:e|ium)\/(\d+[\d.]*)/i)
  const firefoxMatch = ua.match(/firefox\/(\d+[\d.]*)/i)
  const safariMatch = ua.match(/version\/(\d+[\d.]*).*safari/i)

  if (edgeMatch) {
    browser = 'Edge'
    browserVersion = edgeMatch[1] ?? ''
  } else if (firefoxMatch) {
    browser = 'Firefox'
    browserVersion = firefoxMatch[1] ?? ''
  } else if (safariMatch) {
    browser = 'Safari'
    browserVersion = safariMatch[1] ?? ''
  } else if (chromeMatch) {
    browser = 'Chrome'
    browserVersion = chromeMatch[1] ?? ''
  }

  let icon = MonitorIcon
  if (/mobile|android|iphone/i.test(ua)) icon = SmartphoneIcon
  else if (/tablet|ipad/i.test(ua)) icon = TabletIcon

  return { os, browser, browserVersion, icon }
}
