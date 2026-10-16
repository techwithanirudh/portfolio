'use client'

import { useLenis } from 'lenis/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useEffectEvent, useRef } from 'react'
import { useMediaQuery } from 'usehooks-ts'
import type { MyUIMessage } from '@/app/api/chat/types'
import { useAssistantContext } from '@/components/features/assistant/context'
import { Icons } from '@/components/icons/icons'
import { prefersReducedMotion } from '@/lib/reduced-motion'

type NavigateToolPart = Extract<
  MyUIMessage['parts'][number],
  { type: 'tool-navigate' }
>

const HASH_WAIT_MS = 10_000
const HASH_POLL_MS = 50

const handledCalls = new Set<string>()

const LOCKED_OVERFLOW = /hidden|clip/

// The mobile panel is a modal that locks page scroll until it finishes closing
const isScrollLocked = () =>
  [document.documentElement, document.body].some((element) =>
    LOCKED_OVERFLOW.test(getComputedStyle(element).overflowY)
  )

export function NavigatePart({ part }: { part: NavigateToolPart }) {
  const router = useRouter()
  const lenis = useLenis()
  const lenisRef = useRef(lenis)
  const mountedRef = useRef(false)
  const { setOpen } = useAssistantContext()
  const isDocked = useMediaQuery('(min-width: 64rem)')
  const output = part.state === 'output-available' ? part.output : null
  const href = output?.success ? output.href : null

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
        const immediate = prefersReducedMotion()
        if (current) {
          current.resize()
          current.scrollTo(target, { immediate })
        } else {
          target.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth' })
        }
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
      <p className='flex items-center gap-2 text-muted-foreground text-xs'>
        <Icons.pawPrint aria-hidden className='size-3.5' />
        heading there...
      </p>
    )
  }

  if (!output.success) {
    return (
      <p className='flex items-center gap-2 text-muted-foreground text-xs'>
        <Icons.warning aria-hidden className='size-3.5' />
        couldn&apos;t find that page
      </p>
    )
  }

  return (
    <p className='flex items-center gap-2 text-muted-foreground text-xs'>
      <Icons.arrowUpRight aria-hidden className='size-3.5 text-primary' />
      <span>
        took you to{' '}
        <Link className='link-underline text-foreground' href={output.href}>
          {output.section ? `${output.title}, ${output.section}` : output.title}
        </Link>
      </span>
    </p>
  )
}
