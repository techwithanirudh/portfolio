import {
  adminClient,
  inferAdditionalFields,
  multiSessionClient,
} from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import { toast } from '@/lib/toast'
import type { auth } from '@/server/auth'

// @see https://github.com/better-auth/better-auth/issues/1391
export const authClient = createAuthClient({
  fetchOptions: {
    onError(e) {
      if (e.error.status === 429) {
        toast.error('Too many attempts. Wait a moment, then try again.')
      }
    },
  },
  plugins: [
    adminClient(),
    inferAdditionalFields<typeof auth>(),
    multiSessionClient(),
  ],
})

export const { signIn, signOut, useSession } = authClient

export type User = (typeof authClient.$Infer.Session)['user']
