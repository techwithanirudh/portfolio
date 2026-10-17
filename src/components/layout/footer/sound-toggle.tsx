'use client'

import { m } from 'motion/react'
import { IconSwap, IconSwapItem } from '@/components/icon-swap'
import { Icons } from '@/components/icons/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { toggleSound, useSoundEnabled } from '@/lib/audio/preferences'

export function SoundToggle() {
  const enabled = useSoundEnabled()
  const label = enabled ? 'Mute sounds' : 'Turn sounds on'

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            aria-label={label}
            aria-pressed={enabled}
            className='inline-flex size-9 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'
            data-sound='off'
            onClick={toggleSound}
            type='button'
          />
        }
      >
        <IconSwap>
          <IconSwapItem
            as={m.span}
            className='inline-flex'
            key={enabled ? 'on' : 'off'}
          >
            {enabled ? (
              <Icons.volumeOn className='size-4' />
            ) : (
              <Icons.volumeOff className='size-4' />
            )}
          </IconSwapItem>
        </IconSwap>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
