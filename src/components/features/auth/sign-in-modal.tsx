'use client'

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { signIn } from '@/lib/auth-client'
import { SIGN_IN_PARAM, sanitizeRedirect } from '@/lib/auth-url'
import { toast } from '@/lib/toast'

type Provider = 'google' | 'github'

interface SignInModalContextValue {
  /** Open the modal. `redirectTo` defaults to the current page. */
  open: (redirectTo?: string) => void
}

const SignInModalContext = createContext<SignInModalContextValue | null>(null)

export function useSignInModal() {
  const ctx = useContext(SignInModalContext)
  if (!ctx) {
    throw new Error('useSignInModal must be used within SignInModalProvider')
  }
  return ctx
}

const currentPath = () => `${window.location.pathname}${window.location.search}`

export function SignInModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [redirectTo, setRedirectTo] = useState('/')
  const [pending, setPending] = useState<Provider | null>(null)

  const open = useCallback((target?: string) => {
    setRedirectTo(sanitizeRedirect(target ?? currentPath()))
    setIsOpen(true)
  }, [])

  // Server-side guards redirect to `/?signin=<path>`, so open the modal for those.
  useEffect(() => {
    const url = new URL(window.location.href)
    const target = url.searchParams.get(SIGN_IN_PARAM)
    if (target === null) {
      return
    }
    url.searchParams.delete(SIGN_IN_PARAM)
    window.history.replaceState(null, '', url)
    open(target)
  }, [open])

  const signInWithProvider = async (provider: Provider) => {
    if (pending) {
      return
    }
    try {
      setPending(provider)
      await signIn.social({ callbackURL: redirectTo, provider })
    } catch {
      toast.error('Sign in failed. Please try again.')
      setPending(null)
    }
  }

  const value = useMemo(() => ({ open }), [open])

  return (
    <SignInModalContext value={value}>
      {children}
      <Dialog
        onOpenChange={(next) => {
          setIsOpen(next)
          if (!next) {
            setPending(null)
          }
        }}
        open={isOpen}
      >
        <DialogContent className='dashed-frame rounded-none shadow-none ring-0 sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='text-lg'>Sign In</DialogTitle>
            <DialogDescription>
              Use your Google or GitHub account.
            </DialogDescription>
          </DialogHeader>
          <div className='flex flex-col gap-2'>
            {(
              [
                ['google', Icons.google, 'Google'],
                ['github', Icons.github, 'GitHub'],
              ] as const
            ).map(([provider, Icon, label]) => (
              <Button
                className='w-full gap-2'
                disabled={pending !== null}
                key={provider}
                onClick={() => signInWithProvider(provider)}
                shape='square'
                variant='dashed'
              >
                {pending === provider ? (
                  <Icons.spinner className='size-4 animate-spin' />
                ) : (
                  <Icon />
                )}
                Sign in with {label}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </SignInModalContext>
  )
}
