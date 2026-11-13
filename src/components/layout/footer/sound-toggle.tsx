'use client'

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
            // No aria-pressed: the label names the action, so "Mute sounds, pressed" read as muted
            aria-label={label}
            className='relative inline-flex size-9 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-[color,background-color,scale] duration-150 ease-out-strong after:absolute after:-inset-0.5 hover:bg-accent hover:text-foreground active:scale-96'
            data-sound='off'
            onClick={toggleSound}
            type='button'
          />
        }
      >
        <IconSwap>
          <IconSwapItem className='inline-flex' key={enabled ? 'on' : 'off'}>
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
