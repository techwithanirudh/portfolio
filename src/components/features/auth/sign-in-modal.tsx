'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  createContext,
  type ReactNode,
  Suspense,
  use,
  useCallback,
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

// Opens the modal when the server sent the visitor here with `?signin=/path`.
function SignInParamListener({
  onOpen,
}: {
  onOpen: (redirectTo: string) => void
}) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const param = searchParams.get(SIGN_IN_PARAM)

  useEffect(() => {
    if (param === null) {
      return
    }
    onOpen(sanitizeRedirect(param))

    const next = new URLSearchParams(searchParams.toString())
    next.delete(SIGN_IN_PARAM)
    const query = next.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }, [param, onOpen, pathname, router, searchParams])

  return null
}

export function SignInModalProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [redirectTo, setRedirectTo] = useState('/')
  const [loadingProvider, setLoadingProvider] = useState<Provider | null>(null)

  const openWith = useCallback((target: string) => {
    setRedirectTo(target)
    setOpen(true)
  }, [])

  const openSignIn = useCallback(
    (target?: string) => openWith(sanitizeRedirect(target ?? pathname)),
    [openWith, pathname]
  )

  const value = useMemo(() => ({ openSignIn }), [openSignIn])

  const signInWithProvider = async (provider: Provider) => {
    if (loadingProvider) {
      return
    }

    try {
      setLoadingProvider(provider)
      await signIn.social({ callbackURL: redirectTo, provider })
    } catch {
      toast.error('Sign in failed. Please try again.')
      setLoadingProvider(null)
    }
  }

  const providers: { id: Provider; label: string; icon: ReactNode }[] = [
    { icon: <Icons.google />, id: 'google', label: 'Sign in with Google' },
    { icon: <Icons.github />, id: 'github', label: 'Sign in with GitHub' },
  ]

  return (
    <SignInModalContext.Provider value={value}>
      {children}
      <Suspense>
        <SignInParamListener onOpen={openWith} />
      </Suspense>
      <Dialog
        onOpenChange={(next) => {
          setOpen(next)
          if (!next) {
            setLoadingProvider(null)
          }
        }}
        open={open}
      >
        <DialogContent className='max-sm:data-closed:slide-out-to-bottom max-sm:data-open:slide-in-from-bottom max-sm:top-auto max-sm:bottom-0 max-sm:max-w-full max-sm:translate-y-0 max-sm:rounded-b-none max-sm:pb-8 sm:max-w-sm'>
          <DialogHeader>
            <DialogTitle className='text-lg'>Sign In</DialogTitle>
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
    </SignInModalContext.Provider>
  )
}
