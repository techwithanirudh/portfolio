'use client'

import { formatZoned, useNow } from './use-now'

interface LiveTimeProps {
  className?: string
  seconds?: boolean
}

/** Current time in IST, e.g. `14:02 IST`. Renders a placeholder before mount. */
export function LiveTime({ className, seconds = false }: LiveTimeProps) {
  const now = useNow(seconds ? 1000 : 15_000)
  const placeholder = seconds ? '--:--:--' : '--:--'
  return (
    <time
      className={className}
      dateTime={now?.toISOString()}
      suppressHydrationWarning
    >
      {now
        ? formatZoned(now, {
            hour: '2-digit',
            minute: '2-digit',
            second: seconds ? '2-digit' : undefined,
          })
        : placeholder}{' '}
      IST
    </time>
  )
}
