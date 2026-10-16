'use client'

// Adapted from chanhdai.com (MIT, (c) Chanh Dai): https://github.com/ncdai/chanhdai.com
import { useId } from 'react'
import { CopyStateIcon } from '@/components/copy-button'
import { Icons } from '@/components/icons/icons'
import { InlineScript } from '@/components/inline-script'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { useIsClient } from '@/hooks/use-is-client'
import { IntroItem, IntroItemContent, IntroItemIcon } from './intro-item'

// Runs before first paint so the HTML never has the address and nothing flashes
function revealEncodedText(id: string, textB64: string) {
  const el = document.getElementById(id)
  if (el) {
    el.textContent = atob(textB64)
  }
}

export function EmailItem({ emailB64 }: { emailB64: string }) {
  const id = useId()
  const isClient = useIsClient()
  const email = isClient ? atob(emailB64) : ''
  const { copy, state } = useCopyToClipboard()

  return (
    <IntroItem className='group'>
      <IntroItemIcon>
        <Icons.mail />
      </IntroItemIcon>
      <IntroItemContent className='flex min-w-0'>
        {/* Copies instead of opening a mail app, most people want the address */}
        {/* The visible address is the accessible name, so the label matches the screen */}
        <button
          className='group/copy flex min-w-0 cursor-copy items-center gap-1.5 text-left'
          onClick={() => copy(() => atob(emailB64))}
          type='button'
        >
          <span className='sr-only'>Copy </span>
          <span
            className='link-underline min-w-0 break-all'
            id={id}
            suppressHydrationWarning
          >
            {email}
          </span>
          <span
            aria-hidden
            className='flex shrink-0 text-muted-foreground opacity-0 pointer-coarse:opacity-100 transition-opacity group-hover/copy:opacity-100 group-focus-visible/copy:opacity-100 data-[state=done]:opacity-100 data-[state=error]:opacity-100 [&_svg]:size-3.5'
            data-state={state}
          >
            <CopyStateIcon state={state} />
          </span>
        </button>
        <span aria-live='polite' className='sr-only'>
          {state === 'done' ? 'Email copied' : ''}
        </span>
      </IntroItemContent>
      <InlineScript
        html={`(${revealEncodedText.toString()})(${JSON.stringify(id)},${JSON.stringify(emailB64)})`}
      />
    </IntroItem>
  )
}
