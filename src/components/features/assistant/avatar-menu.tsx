'use client'

import { useSound } from '@web-kits/audio/react'
import { useMascot } from '@/components/features/assistant/mascot'
import { AvatarIcon } from '@/components/features/assistant/mascot/avatar-icon'
import {
  type AvatarName,
  avatarMeta,
  avatarNames,
} from '@/components/features/assistant/mascot/constants'
import { Icons } from '@/components/icons/icons'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { tap } from '@/lib/audio/minimal'

// The whole header title (avatar + name) opens a menu to switch the avatar
export function AvatarMenu() {
  const { avatar, setAvatar } = useMascot()
  const playTap = useSound(tap)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label='Change avatar'
        className='flex h-full min-w-0 flex-1 items-center gap-2 rounded-none bg-fd-card px-3 text-fd-card-foreground transition-colors hover:bg-fd-accent/50 focus-visible:outline-2 focus-visible:outline-fd-ring focus-visible:-outline-offset-2'
        data-native-cursor
      >
        <AvatarIcon avatar={avatar} size={24} />
        <span className='font-medium text-sm'>Ask Simba</span>
        <Icons.chevronDown className='size-3.5 text-fd-muted-foreground' />
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
