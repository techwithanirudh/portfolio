'use client'

// Previous/next project arrows plus ←/→ keys, adapted from chanhdai.com's doc
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

interface AdjacentProject {
  title: string
  url: string
}

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable ||
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))

export function ProjectNav({
  previous,
  next,
}: {
  previous?: AdjacentProject
  next?: AdjacentProject
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
    <nav aria-label='Previous and next project' className='flex gap-2'>
      {previous && (
        <NavButton
          direction='previous'
          icon={<Icons.arrowLeft />}
          project={previous}
        />
      )}
      {next && (
        <NavButton
          direction='next'
          icon={<Icons.arrowRight />}
          project={next}
        />
      )}
    </nav>
  )
}

function NavButton({
  direction,
  icon,
  project,
}: {
  direction: 'previous' | 'next'
  icon: React.ReactNode
  project: AdjacentProject
}) {
  const label = direction === 'previous' ? 'Previous project' : 'Next project'

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            nativeButton={false}
            render={
              <Link
                aria-label={`${label}: ${project.title}`}
                href={project.url}
              />
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
          {project.title}
          <Kbd>{icon}</Kbd>
        </span>
      </TooltipContent>
    </Tooltip>
  )
}
