'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks'
import { subscribe } from '@/app/(home)/blog/actions/newsletter'
import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormStatus,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/lib/toast'
import { NewsletterSchema } from '@/lib/validators'

export const NewsletterForm = () => {
  const { form, action, handleSubmitWithAction } = useHookFormAction(
    subscribe,
    zodResolver(NewsletterSchema),
    {
      actionProps: {
        onError: ({ error }) => {
          toast.error(
            typeof error.serverError === 'string'
              ? error.serverError
              : 'Failed to subscribe.'
          )
        },
        onSuccess: ({ data }) => {
          toast.success(data?.message ?? "You're subscribed.")
        },
      },
      errorMapProps: {},
      formProps: {
        defaultValues: {
          email: '',
        },
      },
    }
  )

  return (
    <Form {...form}>
      <form className='flex-1' onSubmit={handleSubmitWithAction}>
        <div className='flex min-h-14'>
          <div className='flex-1'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='group h-full'>
                  <FormLabel className='sr-only'>Email address</FormLabel>
                  <FormControl className='h-full group-has-[p]:pt-3'>
                    <Input
                      {...field}
                      className='h-full min-h-14'
                      disabled={action.status === 'executing'}
                      placeholder='Email address'
                      type='email'
                      variant='flush'
                    />
                  </FormControl>
                  <FormMessage className='ml-4 pb-2 text-xs' />
                </FormItem>
              )}
            />
          </div>

          <Button
            aria-label='Subscribe'
            className='h-auto w-16 shrink-0 px-0 ring-0 active:scale-100 active:opacity-90'
            disabled={action.status === 'executing'}
            type='submit'
          >
            {action.status === 'executing' ? (
              <Icons.spinner className='size-4 animate-spin' />
            ) : (
              <Icons.send className='size-4 -translate-x-[3px] rotate-45 transition-transform group-hover/button:rotate-0' />
            )}
          </Button>
        </div>

        {action.status === 'hasSucceeded' && (
          <FormStatus variant='success'>
            {action.result.data?.message ?? "Hmm... Our server didn't respond."}
          </FormStatus>
        )}
        {action.result.serverError && (
          <FormStatus variant='error'>
            {typeof action.result.serverError === 'string'
              ? action.result.serverError
              : 'Failed to subscribe.'}
          </FormStatus>
        )}
      </form>
    </Form>
  )
}
