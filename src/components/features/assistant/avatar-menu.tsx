'use client'

import { useSound } from '@web-kits/audio/react'
import { useMascot } from '@/components/features/assistant/mascot'
import { AvatarIcon } from '@/components/features/assistant/mascot/avatar-icon'
import {
  type AvatarName,
  avatarMeta,
  avatarNames,
} from '@/components/features/assistant/mascot/constants'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { tap } from '@/lib/audio/minimal'

// The header icon is the current avatar, and opens a menu to switch it
export function AvatarMenu() {
  const { avatar, setAvatar } = useMascot()
  const playTap = useSound(tap)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label='Change avatar'
        className='rounded-sm transition-transform duration-200 hover:scale-110 focus-visible:outline-2 focus-visible:outline-fd-ring'
      >
        <AvatarIcon avatar={avatar} size={24} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='z-[60] w-64'>
        <DropdownMenuRadioGroup
          onValueChange={(value) => {
            playTap()
            setAvatar(value as AvatarName)
          }}
          value={avatar}
        >
          {/* Base UI requires group labels to live inside a group */}
          <DropdownMenuLabel>Choose an avatar</DropdownMenuLabel>
          {avatarNames.map((name) => (
            <DropdownMenuRadioItem className='gap-3' key={name} value={name}>
              <AvatarIcon avatar={name} size={32} />
              <span className='flex flex-col'>
                <span className='font-medium'>{avatarMeta[name].label}</span>
                <span className='text-muted-foreground text-xs'>
                  {avatarMeta[name].description}
                </span>
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
