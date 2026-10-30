import type { KeyboardEvent } from 'react'
import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface EntryEditFormProps {
  draft: string
  isBusy: boolean
  isSaving: boolean
  onCancel: () => void
  onChange: (value: string) => void
  onSave: () => void
}

export const EntryEditForm = ({
  draft,
  isBusy,
  isSaving,
  onCancel,
  onChange,
  onSave,
}: EntryEditFormProps) => {
  const cancelOnEscape = (event: KeyboardEvent<HTMLElement>) => {
    if (
      event.key === 'Escape' &&
      !event.defaultPrevented &&
      !event.nativeEvent.isComposing &&
      !isBusy
    ) {
      event.stopPropagation()
      onCancel()
    }
  }

  return (
    <div className='space-y-3'>
      <Textarea
        aria-label='Edit message'
        className='wrap-anywhere min-h-[8rem] resize-y bg-background'
        disabled={isBusy}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={cancelOnEscape}
        value={draft}
      />
      <div className='flex flex-wrap gap-2'>
        <Button
          className='px-4'
          disabled={isBusy}
          onClick={onSave}
          onKeyDown={cancelOnEscape}
          size='sm'
          type='button'
        >
          {isSaving ? <Icons.spinner className='size-4 animate-spin' /> : null}
          Save
        </Button>
        <Button
          disabled={isBusy}
          onClick={onCancel}
          onKeyDown={cancelOnEscape}
          size='sm'
          type='button'
          variant='ghost'
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
