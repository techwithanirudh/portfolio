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

// The header title (current avatar + name) opens a menu to switch avatars
export function AvatarMenu() {
  const { avatar, setAvatar } = useMascot()
  const playTap = useSound(tap)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label='Ask Simba, change avatar'
        className='group -ml-3 flex h-full items-center gap-2 px-3 transition-colors hover:bg-fd-accent/60 focus-visible:bg-fd-accent/60 focus-visible:outline-none aria-expanded:bg-fd-accent/60'
        data-sound-press='off'
      >
        <AvatarIcon
          avatar={avatar}
          className='transition-transform duration-200 group-hover:scale-110'
          size={24}
        />
        <span className='font-medium text-sm'>Ask Simba</span>
        <Icons.chevronDown className='size-3.5 text-fd-muted-foreground transition-transform duration-200 group-aria-expanded:rotate-180' />
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
            <DropdownMenuRadioItem
              className='gap-3'
              closeOnClick
              key={name}
              value={name}
            >
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
