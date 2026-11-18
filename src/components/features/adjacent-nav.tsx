'use client'

// Previous/next arrows (projects, posts) plus ←/→ keys, adapted from chanhdai.com's doc
// adjacent-page nav (https://github.com/ncdai/chanhdai.com, MIT)

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'
import { Kbd } from '@/components/ui/kbd'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface Adjacent {
  title: string
  url: string
}

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable ||
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))

export function AdjacentNav({
  className,
  noun,
  previous,
  next,
}: {
  className?: string
  /** What the arrows move between, for the labels */
  noun: 'post' | 'project'
  previous?: Adjacent
  next?: Adjacent
}) {
  const router = useRouter()

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      // Someone else (a carousel, a dialog, a text field) already owns this key
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        isTyping(event.target)
      ) {
        return
      }
      const target = { ArrowLeft: previous, ArrowRight: next }[event.key]
      if (target) {
        router.push(target.url)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [previous, next, router])

  return (
    <nav
      aria-label={`Previous and next ${noun}`}
      className={cn('flex gap-2', className)}
    >
      {previous && (
        <NavButton
          direction='previous'
          icon={<Icons.arrowLeft />}
          item={previous}
          noun={noun}
        />
      )}
      {next && (
        <NavButton
          direction='next'
          icon={<Icons.arrowRight />}
          item={next}
          noun={noun}
        />
      )}
    </nav>
  )
}

function NavButton({
  direction,
  icon,
  item,
  noun,
}: {
  direction: 'previous' | 'next'
  icon: React.ReactNode
  item: Adjacent
  noun: string
}) {
  const label = `${direction === 'previous' ? 'Previous' : 'Next'} ${noun}`

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            nativeButton={false}
            render={
              <Link aria-label={`${label}: ${item.title}`} href={item.url} />
            }
            size='icon-sm'
            variant='outline'
          />
        }
      >
        {icon}
      </TooltipTrigger>
      <TooltipContent>
        <span className='flex items-center gap-3'>
          {item.title}
          <Kbd>{icon}</Kbd>
        </span>
      </TooltipContent>
    </Tooltip>
  )
}
