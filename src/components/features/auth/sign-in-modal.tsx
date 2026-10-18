'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import {
  createContext,
  type ReactNode,
  type RefObject,
  Suspense,
  use,
  useCallback,
  useMemo,
  useRef,
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
  openSignIn: (redirectTo?: string) => void
}

const SignInModalContext = createContext<SignInModalContextValue | null>(null)

export function useSignInModal(): SignInModalContextValue {
  const ctx = use(SignInModalContext)
  if (ctx === null) {
    throw new Error('useSignInModal must be used within a SignInModalProvider')
  }
  return ctx
}

export function SignInModalProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const pushedHref = useRef<string | null>(null)

  const openSignIn = useCallback(
    (target?: string) => {
      const url = new URL(window.location.href)
      url.searchParams.set(SIGN_IN_PARAM, sanitizeRedirect(target ?? pathname))
      pushedHref.current = url.href
      window.history.pushState(null, '', url)
    },
    [pathname]
  )

  const value = useMemo(() => ({ openSignIn }), [openSignIn])

  return (
    <SignInModalContext value={value}>
      {children}
      <Suspense>
        <SignInDialog pushedHref={pushedHref} />
      </Suspense>
    </SignInModalContext>
  )
}

const providers: { id: Provider; label: string; icon: ReactNode }[] = [
  { icon: <Icons.google />, id: 'google', label: 'Sign in with Google' },
  { icon: <Icons.github />, id: 'github', label: 'Sign in with GitHub' },
]

function SignInDialog({
  pushedHref,
}: {
  pushedHref: RefObject<string | null>
}) {
  const searchParams = useSearchParams()
  const param = searchParams.get(SIGN_IN_PARAM)
  const redirectTo = param === null ? null : sanitizeRedirect(param)
  const [loadingProvider, setLoadingProvider] = useState<Provider | null>(null)

  const close = () => {
    setLoadingProvider(null)
    if (param === null) {
      return
    }
    if (pushedHref.current === window.location.href) {
      pushedHref.current = null
      window.history.back()
      return
    }
    const next = new URLSearchParams(searchParams.toString())
    next.delete(SIGN_IN_PARAM)
    const query = next.toString()
    const { pathname } = window.location
    window.history.replaceState(
      null,
      '',
      query ? `${pathname}?${query}` : pathname
    )
  }

  const signInWithProvider = async (provider: Provider) => {
    if (loadingProvider || redirectTo === null) {
      return
    }

    try {
      setLoadingProvider(provider)
      const result = await signIn.social({ callbackURL: redirectTo, provider })
      if (result?.error) {
        toast.error('Sign in failed. Please try again.')
        setLoadingProvider(null)
      }
      // TODO(slopradar): swallowed-error: the catch drops the thrown error without logging it and repeats the result.error branch word for word; log it (console.error like mermaid.tsx) and route both paths through one failure handler
    } catch {
      toast.error('Sign in failed. Please try again.')
      setLoadingProvider(null)
    }
  }

  return (
    <Dialog
      onOpenChange={(next) => {
        if (!next) {
          close()
        }
      }}
      open={redirectTo !== null}
    >
      <DialogContent className='max-sm:data-closed:slide-out-to-bottom-[30%] max-sm:data-open:slide-in-from-bottom max-sm:top-auto max-sm:bottom-0 max-sm:max-w-full max-sm:translate-y-0 max-sm:rounded-b-none max-sm:pb-8 sm:max-w-sm'>
        <DialogHeader>
          <DialogTitle className='text-lg'>Sign in</DialogTitle>
          <DialogDescription>
            Use your Google or GitHub account.
          </DialogDescription>
        </DialogHeader>
        <div className='flex w-full flex-col gap-2'>
          {providers.map(({ id, label, icon }) => (
            <Button
              className='w-full gap-2'
              disabled={loadingProvider !== null}
              key={id}
              onClick={() => signInWithProvider(id)}
              variant='outline'
            >
              {loadingProvider === id ? (
                <Icons.spinner className='size-4 animate-spin' />
              ) : (
                icon
              )}
              {label}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
