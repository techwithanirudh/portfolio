'use client'

import { useLenis } from 'lenis/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useEffectEvent, useRef } from 'react'
import { useMediaQuery } from 'usehooks-ts'
import { useAssistantContext } from '@/components/features/assistant/context'
import { Icons } from '@/components/icons/icons'
import { scrollToTarget } from '@/components/layout/lenis'
import { MEDIA } from '@/lib/media'
import { prefersReducedMotion } from '@/lib/reduced-motion'
import { ToolPendingLine, ToolWarningLine } from './status-line'
import type { ToolPart } from './types'

const HASH_WAIT_MS = 10_000
const HASH_POLL_MS = 50

const handledCalls = new Set<string>()

const LOCKED_OVERFLOW = /hidden|clip/

// The mobile panel is a modal that locks page scroll until it finishes closing
const isScrollLocked = () =>
  [document.documentElement, document.body].some((element) =>
    LOCKED_OVERFLOW.test(getComputedStyle(element).overflowY)
  )

export function NavigatePart({ part }: { part: ToolPart<'navigate'> }) {
  const router = useRouter()
  const lenis = useLenis()
  const lenisRef = useRef(lenis)
  const mountedRef = useRef(false)
  const { setOpen } = useAssistantContext()
  const isDocked = useMediaQuery(MEDIA.docked)
  const output = part.state === 'output-available' ? part.output : null
  const href = output?.success ? output.href : null

  // TODO(slopradar): mirrored-state: lenisRef and mountedRef are synced by effects so a 10s setTimeout poll can read them, and the hash scroll duplicates search/dialog.tsx navigateToUrl; share one scrollToHash helper that waits on the route instead of polling
  useEffect(() => {
    lenisRef.current = lenis
  }, [lenis])

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  // Lenis cancels native smooth scrolling and remounts with each page, so a
  // scroll waits for the current instance while this part is still mounted
  const scrollToSection = (path: string, id: string) => {
    const startedAt = Date.now()
    const sameRoute = window.location.pathname === path
    const previous = sameRoute ? null : document.getElementById(id)

    const tick = () => {
      const target = document.getElementById(id)
      const timedOut = Date.now() - startedAt >= HASH_WAIT_MS
      const current = mountedRef.current ? lenisRef.current : undefined
      const awaitingLenis =
        mountedRef.current &&
        !current &&
        document.documentElement.classList.contains('lenis')
      const ready =
        target &&
        target !== previous &&
        window.location.pathname === path &&
        !(awaitingLenis || isScrollLocked())

      if (ready || (timedOut && target)) {
        current?.resize()
        scrollToTarget(current, target, { immediate: prefersReducedMotion() })
        return
      }
      if (!timedOut) {
        window.setTimeout(tick, HASH_POLL_MS)
      }
    }
    tick()
  }

  const go = useEffectEvent((target: string) => {
    if (handledCalls.has(part.toolCallId)) {
      return
    }
    handledCalls.add(part.toolCallId)

    const [path = '/', id] = target.split('#')
    if (!isDocked) {
      setOpen(false)
    }
    router.push(target, { scroll: !id })
    if (id) {
      scrollToSection(path, id)
    }
  })

  useEffect(() => {
    if (href) {
      go(href)
    }
  }, [href])

  if (!output) {
    return (
      <ToolPendingLine icon={Icons.compass}>
        {`taking you to ${part.input?.path ?? 'the page'}…`}
      </ToolPendingLine>
    )
  }

  if (!output.success) {
    return <ToolWarningLine>couldn&apos;t find that page</ToolWarningLine>
  }

  return (
    <p className='flex items-center gap-2 text-sm'>
      <Icons.compass
        aria-hidden
        className='size-4 shrink-0 text-muted-foreground'
      />
      <span>
        took you to{' '}
        <Link className='link-underline' href={output.href}>
          {output.section ? `${output.title}, ${output.section}` : output.title}
        </Link>
      </span>
    </p>
  )
}
