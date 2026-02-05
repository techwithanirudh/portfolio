'use client'

import { useAuthenticate } from '@daveyplate/better-auth-ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks'
import { useRouter } from 'next/navigation'
import { type BaseSyntheticEvent, useState } from 'react'
import { Icons } from '@/components/icons/icons'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { useSession } from '@/lib/auth-client'
import { GuestbookEntrySchema } from '@/lib/validators'
import { createGuestbookEntry } from '../actions/guestbook'

export const GuestbookForm = () => {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const user = session?.user
  const [authenticate, setAuthenticate] = useState(false)

  useAuthenticate({
    enabled: authenticate,
  })

  const { form, action, handleSubmitWithAction, resetFormAndAction } =
    useHookFormAction(createGuestbookEntry, zodResolver(GuestbookEntrySchema), {
      actionProps: {},
      formProps: {
        mode: 'onBlur',
        defaultValues: {
          message: '',
        },
      },
      errorMapProps: {},
    })

  const handleSubmit = async (event?: BaseSyntheticEvent) => {
    await handleSubmitWithAction(event)

    if (action.hasSucceeded) {
      resetFormAndAction()
      router.refresh()
    }
  }

  if (isPending) {
    return (
      <div className='flex w-full flex-col items-center justify-center size-full text-sm text-muted-foreground'>
        <Icons.spinner className='size-4 animate-spin' />
      </div>
    )
  }

  if (!user && !isPending) {
    return (
      <div className='flex w-full flex-col gap-4 text-center'>
        <p className='text-muted-foreground text-sm'>
          Sign in to leave a guestbook message.
        </p>
        <Button className='w-full' onClick={() => setAuthenticate(true)}>
          Sign in to post
        </Button>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form className='flex-1 space-y-6' onSubmit={handleSubmit}>
        <FormField
          control={form.control}
          name='message'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  className='min-h-[10rem] resize-y bg-background'
                  placeholder='Say hello...'
                  {...field}
                  disabled={action.status === 'executing'}
                />
              </FormControl>
              {form.formState.errors.message ? (
                <FormMessage />
              ) : (
                <FormDescription>
                  Posting as {user.name ?? 'Guest'}.
                </FormDescription>
              )}
            </FormItem>
          )}
        />
        <Button
          className='w-full'
          disabled={action.status === 'executing'}
          type='submit'
        >
          {action.status === 'executing' ? (
            <Icons.spinner className='mr-2 size-4 animate-spin' />
          ) : null}
          Leave message
        </Button>
        {action.status === 'hasSucceeded' && (
          <Alert className='border-emerald-500/15 bg-emerald-500/15 p-3 px-3 py-2 text-emerald-500 has-[>svg]:gap-x-1.5'>
            <Icons.success size={16} />
            <AlertTitle className='mb-0 leading-normal'>
              Thanks for signing the guestbook!
            </AlertTitle>
          </Alert>
        )}
        {action.result.serverError && (
          <Alert className='border-destructive/15 bg-destructive/15 p-3 px-3 py-2 text-destructive has-[>svg]:gap-x-1.5 dark:border-destructive dark:bg-destructive dark:text-destructive-foreground'>
            <Icons.warning className='size-4' />
            <AlertTitle className='mb-0 leading-normal'>
              {action.result.serverError}
            </AlertTitle>
          </Alert>
        )}
      </form>
    </Form>
  )
}
