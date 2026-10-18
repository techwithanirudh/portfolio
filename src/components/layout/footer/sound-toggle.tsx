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
            aria-label={label}
            aria-pressed={enabled}
            // TODO(slopradar): copied-variant: hand-rolls an outline icon button (border, size-9, hover, active scale) beside Clock which uses <Button>, render <Button size='icon' variant='outline'> instead
            className='relative inline-flex size-9 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-[color,background-color,scale] duration-150 ease-out-strong after:absolute after:-inset-0.5 hover:bg-accent hover:text-foreground active:scale-[0.96]'
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
