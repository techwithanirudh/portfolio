'use client'

import { MorphIcon, morphIcons } from '@/components/icons/morph-icon'
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
        <MorphIcon
          className='size-4'
          icon={enabled ? morphIcons.volumeOn : morphIcons.volumeOff}
        />
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
