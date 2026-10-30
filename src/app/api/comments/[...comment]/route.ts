import { NextComment } from '@fuma-comment/server/next'
import { auth, storage } from '@/server/comments/config'

export const { GET, DELETE, PATCH, POST } = NextComment({
  auth,
  mention: { enabled: true },
  storage,
})
