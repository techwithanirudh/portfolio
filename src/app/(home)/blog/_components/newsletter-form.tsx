'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks'
import { subscribe } from '@/app/(home)/blog/actions/newsletter'
import { Icons } from '@/components/icons/icons'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { getActionErrorMessage } from '@/lib/safe-action/error-message'
import { toast } from '@/lib/toast'
import { NewsletterSchema } from '@/lib/validators'

export const NewsletterForm = () => {
  const { form, action, handleSubmitWithAction } = useHookFormAction(
    subscribe,
    zodResolver(NewsletterSchema),
    {
      actionProps: {
        onError: ({ error }) => {
          toast.error(getActionErrorMessage(error, 'Failed to subscribe.'))
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
      <form className='flex-1 space-y-4' onSubmit={handleSubmitWithAction}>
        <div className='flex h-full min-h-10 overflow-hidden rounded-md border bg-muted p-0'>
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
                      autoComplete='email'
                      className='h-full rounded-md rounded-r-none border-none px-4 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0'
                      disabled={action.status === 'executing'}
                      placeholder='Email address'
                      type='email'
                    />
                  </FormControl>
                  <FormMessage className='ml-4 pb-2 text-xs' />
                </FormItem>
              )}
            />
          </div>

          <Button
            aria-label='Subscribe'
            className='size-auto w-15 rounded-md rounded-l-none px-3'
            disabled={action.status === 'executing'}
            size='icon'
            type='submit'
          >
            {action.status === 'executing' ? (
              <Icons.spinner className='size-4 animate-spin' />
            ) : (
              // Turned 45deg the plane's ink sits right of its box, so pull it back to look centered
              <Icons.send className='size-4 -translate-x-[3px] rotate-45 transition-transform group-hover/button:rotate-0' />
            )}
          </Button>
        </div>

        {action.status === 'hasSucceeded' && (
          <Alert variant='success'>
            <Icons.success size={16} />
            <AlertTitle className='mb-0 leading-normal'>
              {action.result.data?.message ?? "The server didn't respond."}
            </AlertTitle>
          </Alert>
        )}
        {action.result.serverError && (
          <Alert variant='destructive-soft'>
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
