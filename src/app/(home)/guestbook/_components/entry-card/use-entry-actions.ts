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

export function useEntryActions(
  entry: GuestbookEntryItem,
  { closeBanModal, closeDeleteModal, closeEditor }: EntryActionHandlers
) {
  const router = useRouter()

  const edit = useAction(editGuestbookEntry, {
    onError: ({ error }) => {
      toast.error(
        getActionErrorMessage(error, "Your entry wasn't updated. Try again.")
      )
    },
    onSuccess: () => {
      closeEditor()
      // TODO(slopradar): redundant-refresh: updateTag in the action already re-renders the route, drop router.refresh() and useRouter (x3 in this file)
      router.refresh()
      toast.success('Guestbook entry updated')
    },
  })
  const remove = useAction(removeGuestbookEntry, {
    onError: ({ error }) => {
      toast.error(
        getActionErrorMessage(error, "The entry wasn't deleted. Try again.")
      )
    },
    onSuccess: () => {
      closeEditor()
      closeDeleteModal()
      router.refresh()
      toast.success('Guestbook entry deleted')
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
        entry.banned ? `Unbanned ${entry.name}` : `Banned ${entry.name}`
      )
    },
  })

  const isBusy = edit.isExecuting || remove.isExecuting || ban.isExecuting

  return { ban, edit, isBusy, remove }
}
