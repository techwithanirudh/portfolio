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
      className={cn('rounded-md after:rounded-md', classNames?.base, className)}
      key={src}
      outlined={false}
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
        delay={src ? 200 : 0}
      >
        {initials(name) ?? (
          <Icons.user className={cn('w-[55%]', classNames?.fallbackIcon)} />
        )}
      </AvatarFallback>
    </Avatar>
  )
}

const whitespace = /\s+/

const graphemes = new Intl.Segmenter('en', { granularity: 'grapheme' })

const leadingGraphemes = (word: string, count: number) =>
  Array.from(graphemes.segment(word), ({ segment }) => segment)
    .slice(0, count)
    .join('')

const initials = (name?: string | null) => {
  const [first, ...rest] = name?.trim().split(whitespace).filter(Boolean) ?? []
  if (!first) {
    return null
  }
  const last = rest.at(-1)
  return last
    ? leadingGraphemes(first, 1) + leadingGraphemes(last, 1)
    : leadingGraphemes(first, 2)
}
