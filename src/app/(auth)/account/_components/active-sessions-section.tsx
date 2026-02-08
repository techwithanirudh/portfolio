import { requireSession } from '../_lib/session'
import { ActiveSessions } from './active-sessions'

export async function ActiveSessionsSection() {
  const session = await requireSession()
  return <ActiveSessions currentToken={session.session.token} />
}
