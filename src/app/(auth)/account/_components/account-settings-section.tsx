import { requireSession } from '../_lib/session'
import { AccountSettings } from './account-settings'

export async function AccountSettingsSection() {
  const session = await requireSession()
  return <AccountSettings user={session.user} />
}
