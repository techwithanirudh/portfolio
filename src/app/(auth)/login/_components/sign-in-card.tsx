'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { signIn } from '@/lib/auth-client'

const Cross = () => (
  <div className='relative h-6 w-6'>
    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
      <Icons.add className='size-5 text-border/70 dark:text-border' />
    </div>
  </div>
)

export interface SignInCardProps {
  redirectTo: string
}

export function SignInCard({ redirectTo }: SignInCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const signInWithProvider = async (provider: 'google' | 'github') => {
    if (isLoading) {
      return
    }

    try {
      setIsLoading(true)
      await signIn.social({
        provider,
        callbackURL: redirectTo,
      })
    } catch {
      toast.error('Sign in failed. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className='relative mx-auto w-full max-w-xl'>
      <div className='absolute -top-3 -left-3 z-10 hidden h-6 sm:block'>
        <Cross />
      </div>
      <div className='absolute -top-3 -right-3 z-10 hidden h-6 -translate-x-px sm:block'>
        <Cross />
      </div>
      <div className='border-border border-x border-y border-dashed'>
        <Card className='rounded-none border-none'>
          <CardHeader>
            <CardTitle className='text-lg md:text-xl'>Sign In</CardTitle>
            <CardDescription className='text-xs md:text-sm'>
              Sign in with your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex w-full flex-col items-center justify-between gap-2'>
              <Button
                className='w-full gap-2'
                disabled={isLoading}
                onClick={() => {
                  signInWithProvider('google')
                }}
                shape='square'
                variant='dashed'
              >
                {isLoading ? (
                  <Icons.spinner className='size-4 animate-spin' />
                ) : (
                  <Icons.google />
                )}
                Sign in with Google
              </Button>
              <Button
                className='w-full gap-2'
                disabled={isLoading}
                onClick={() => {
                  signInWithProvider('github')
                }}
                shape='square'
                variant='dashed'
              >
                {isLoading ? (
                  <Icons.spinner className='size-4 animate-spin' />
                ) : (
                  <Icons.github />
                )}
                Sign in with GitHub
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='absolute -bottom-3 -left-3 z-10 hidden h-6 sm:block'>
        <Cross />
      </div>
      <div className='absolute -right-3 -bottom-3 z-10 hidden h-6 -translate-x-px sm:block'>
        <Cross />
      </div>
    </div>
  )
}
