'use client'

// Adapted from chanhdai.com (MIT, (c) Chanh Dai): https://github.com/ncdai/chanhdai.com
import { useId } from 'react'
import { CopyButton } from '@/components/copy-button'
import { Icons } from '@/components/icons/icons'
import { InlineScript } from '@/components/inline-script'
import { useIsClient } from '@/hooks/use-is-client'
import { IntroItem, IntroItemContent, IntroItemIcon } from './intro-item'

// Writes the decoded address before first paint, so the served HTML never
// carries it in plain text and there is still no flash on hydration.
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

  return (
    <IntroItem className='group'>
      <IntroItemIcon>
        <Icons.mail />
      </IntroItemIcon>
      <IntroItemContent className='flex'>
        <a
          className='link-underline'
          href={email ? `mailto:${email}` : undefined}
          id={id}
          suppressHydrationWarning
        >
          {email}
        </a>
      </IntroItemContent>
      <div className='-ml-2 opacity-0 pointer-coarse:opacity-100 transition-opacity ease-out group-hover:opacity-100 group-has-focus-visible:opacity-100'>
        <CopyButton
          className='text-muted-foreground'
          size='icon-xs'
          text={() => atob(emailB64)}
          variant='ghost'
        />
      </div>
      <InlineScript
        html={`(${revealEncodedText.toString()})(${JSON.stringify(id)},${JSON.stringify(emailB64)})`}
      />
    </IntroItem>
  )
}
