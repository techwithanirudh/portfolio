import type { ComponentProps } from 'react'

import { Icons } from '@/components/icons/icons'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { User } from '@/lib/auth-client'
import { initials } from '@/lib/initials'
import { cn } from '@/lib/utils'

interface UserAvatarProps {
  user?: User | null
}

export function UserAvatar({
  user,
  className,
  ...props
}: UserAvatarProps & ComponentProps<typeof Avatar>) {
  const name = user?.name || user?.email
  const src = user?.image

  return (
    <Avatar
      className={cn('rounded-md after:rounded-md', className)}
      key={src}
      outlined={false}
      {...props}
    >
      <AvatarImage
        alt={name ?? 'Avatar'}
        className='rounded-md'
        src={src ?? undefined}
      />

      <AvatarFallback
        className='rounded-md bg-transparent'
        delay={src ? 200 : 0}
      >
        {initials(name) ?? <Icons.user className='w-[55%]' />}
      </AvatarFallback>
    </Avatar>
  )
}
