'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAction } from 'next-safe-action/hooks'
import { useForm } from 'react-hook-form'
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
import type { GuestbookEntry } from '@/lib/validators'
import { GuestbookEntrySchema } from '@/lib/validators'
import { createGuestbookEntry } from '../actions/guestbook'

export const GuestbookForm = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user

  const form = useForm({
    resolver: zodResolver(GuestbookEntrySchema),
    mode: 'onBlur',
    defaultValues: {
      message: '',
    },
  })

  const { execute, result, status } = useAction(createGuestbookEntry, {
    onSuccess: () => {
      form.reset()
      router.refresh()
    },
  })

  if (!user) {
    return (
      <div className='flex w-full flex-col gap-4 text-center'>
        <p className='text-muted-foreground text-sm'>
          Sign in to leave a guestbook message.
        </p>
        <Button asChild className='w-full'>
          <Link href='/login'>Sign in to post</Link>
        </Button>
      </div>
    )
  }

  const onSubmit = (values: GuestbookEntry) => {
    execute(values)
  }

  return (
    <Form {...form}>
      <form className='flex-1 space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
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
                  disabled={status === 'executing'}
                />
              </FormControl>
              {form.formState.errors.message ? (
                <FormMessage />
              ) : (
                <FormDescription>
                  Posting as {user.name ?? user.email}.
                </FormDescription>
              )}
            </FormItem>
          )}
        />
        <Button
          className='w-full'
          disabled={status === 'executing'}
          type='submit'
        >
          {status === 'executing' ? (
            <Icons.spinner className='mr-2 size-4 animate-spin' />
          ) : null}
          Leave message
        </Button>
        {status === 'hasSucceeded' && (
          <Alert className='border-emerald-500/15 bg-emerald-500/15 p-3 px-3 py-2 text-emerald-500 has-[>svg]:gap-x-1.5'>
            <Icons.success size={16} />
            <AlertTitle className='mb-0 leading-normal'>
              Thanks for signing the guestbook!
            </AlertTitle>
          </Alert>
        )}
        {result.serverError && (
          <Alert className='border-destructive/15 bg-destructive/15 p-3 px-3 py-2 text-destructive has-[>svg]:gap-x-1.5 dark:border-destructive dark:bg-destructive dark:text-destructive-foreground'>
            <Icons.warning className='size-4' />
            <AlertTitle className='mb-0 leading-normal'>
              {result.serverError}
            </AlertTitle>
          </Alert>
        )}
      </form>
    </Form>
  )
}
