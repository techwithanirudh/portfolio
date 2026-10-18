import {
  adminClient,
  inferAdditionalFields,
  multiSessionClient,
} from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
// TODO(slopradar): inconsistent: imports sonner directly, so the 429 toast skips the sound every other toast plays, import toast from @/lib/toast
import { toast } from 'sonner'

import type { auth } from '@/server/auth'

// @see https://github.com/better-auth/better-auth/issues/1391
export const authClient = createAuthClient({
  fetchOptions: {
    onError(e) {
      if (e.error.status === 429) {
        toast.error('Too many requests. Please try again later.')
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
