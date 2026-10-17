import { useRouter } from 'next/navigation'
import { useAction } from 'next-safe-action/hooks'
import { getActionErrorMessage } from '@/lib/safe-action/error-message'
import { toast } from '@/lib/toast'
import type { GuestbookEntryItem } from '@/lib/validators/guestbook'
import {
  banGuestbookUser,
  editGuestbookEntry,
  removeGuestbookEntry,
} from '../../actions/guestbook'

interface EntryActionHandlers {
  closeBanModal: () => void
  closeDeleteModal: () => void
  closeEditor: () => void
}

// The edit, delete and ban actions of one entry, with their toasts and the
// refresh once the server has the change
export function useEntryActions(
  entry: GuestbookEntryItem,
  { closeBanModal, closeDeleteModal, closeEditor }: EntryActionHandlers
) {
  const router = useRouter()

  const edit = useAction(editGuestbookEntry, {
    onError: ({ error }) => {
      toast.error(
        getActionErrorMessage(error, "Your message wasn't updated. Try again.")
      )
    },
    onSuccess: () => {
      closeEditor()
      router.refresh()
      toast.success('Guestbook entry updated.')
    },
  })
  const remove = useAction(removeGuestbookEntry, {
    onError: ({ error }) => {
      toast.error(
        getActionErrorMessage(error, "The message wasn't deleted. Try again.")
      )
    },
    onSuccess: () => {
      closeEditor()
      closeDeleteModal()
      router.refresh()
      toast.success('Guestbook entry deleted.')
    },
  })
  const ban = useAction(banGuestbookUser, {
    onError: ({ error }) => {
      toast.error(
        getActionErrorMessage(error, "The ban status didn't change. Try again.")
      )
    },
    onSuccess: () => {
      closeEditor()
      closeBanModal()
      router.refresh()
      toast.success(
        entry.banned ? `Unbanned ${entry.name}.` : `Banned ${entry.name}.`
      )
    },
  })

  const isBusy =
    edit.status === 'executing' ||
    remove.status === 'executing' ||
    ban.status === 'executing'

  return { ban, edit, isBusy, remove }
}
