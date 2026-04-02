import type { ComponentProps } from 'react'

import { Icons } from '@/components/icons/icons'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { User } from '@/lib/auth-client'
import { cn } from '@/lib/utils'

export interface UserAvatarClassNames {
  base?: string
  fallback?: string
  fallbackIcon?: string
  image?: string
}

export interface UserAvatarProps {
  classNames?: UserAvatarClassNames
  user?: User | null
}

export function UserAvatar({
  user,
  classNames,
  className,
  ...props
}: UserAvatarProps & ComponentProps<typeof Avatar>) {
  const name = user?.name || user?.email
  const src = user?.image

  return (
    <Avatar
      className={cn('rounded-md', classNames?.base, className)}
      key={src}
      {...props}
    >
      <AvatarImage
        alt={name ?? 'Avatar'}
        className={cn('rounded-md', classNames?.image)}
        src={src ?? undefined}
      />

      <AvatarFallback
        className={cn(
          'rounded-md bg-transparent uppercase',
          classNames?.fallback
        )}
        delayMs={src ? 200 : 0}
      >
        {firstTwoCharacters(name) ?? (
          <Icons.user className={cn('w-[55%]', classNames?.fallbackIcon)} />
        )}
      </AvatarFallback>
    </Avatar>
  )
}

const firstTwoCharacters = (name?: string | null) => name?.slice(0, 2)
