'use client'

import { toast } from 'sonner'
import { Icons } from '@/components/icons/icons'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { cn } from '@/lib/utils'

const iconClassName =
  'absolute transition-[opacity,filter,scale] duration-300 ease-out motion-reduce:transition-none'

// Copies the address instead of opening a mail app; the hook already plays
// the success sound, so the toast comes straight from sonner to avoid a second
export function CopyEmailButton({
  className,
  email,
}: {
  className?: string
  email: string
}) {
  const { copy, state } = useCopyToClipboard({
    onCopyError: () => toast.error(`Couldn't copy, it's ${email}`),
    onCopySuccess: () =>
      toast('Email copied to clipboard', { description: email }),
  })
  const done = state === 'done'

  return (
    <button
      aria-label={done ? 'Email copied' : 'Copy email'}
      className={cn('relative', className)}
      onClick={() => copy(email)}
      type='button'
    >
      <Icons.mail
        className={cn(iconClassName, done && 'scale-50 opacity-0 blur-xs')}
      />
      <Icons.check
        className={cn(
          iconClassName,
          'text-primary',
          !done && 'scale-50 opacity-0 blur-xs'
        )}
      />
    </button>
  )
}
