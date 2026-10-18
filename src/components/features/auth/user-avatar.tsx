import type { ComponentProps } from 'react'

import { Icons } from '@/components/icons/icons'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { User } from '@/lib/auth-client'
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
        className='rounded-md bg-transparent uppercase'
        delay={src ? 200 : 0}
      >
        {initials(name) ?? <Icons.user className='w-[55%]' />}
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

// TODO(slopradar): duplication: a third initials implementation beside the ones in app/(home)/uses/_components/logo.tsx and app/(home)/_components/testimonials.tsx, keep one getInitials in lib/utils
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
