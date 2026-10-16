'use client'

import { toast } from 'sonner'
import { CopyStateIcon } from '@/components/copy-button'
import { morphIcons } from '@/components/icons/morph-icon'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'

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
      className={className}
      onClick={() => copy(email)}
      type='button'
    >
      <CopyStateIcon idleIcon={morphIcons.mail} state={state} />
    </button>
  )
}
