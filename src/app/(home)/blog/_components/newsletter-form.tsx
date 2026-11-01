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
  useFormField,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { getActionErrorMessage } from '@/lib/safe-action/error-message'
import { toast } from '@/lib/toast'
import { NewsletterSchema } from '@/lib/validators/newsletter'

const subscribeFailedMessage =
  "You're not subscribed yet. Check your connection and try again."

const FieldErrorAlert = () => {
  const { error, formMessageId } = useFormField()

  if (!error?.message) {
    return null
  }

  return (
    <Alert id={formMessageId} variant='destructive-soft'>
      <Icons.warning className='size-4' />
      <AlertTitle className='mb-0 leading-normal'>{error.message}</AlertTitle>
    </Alert>
  )
}

export const NewsletterForm = () => {
  const { form, action, handleSubmitWithAction } = useHookFormAction(
    subscribe,
    zodResolver(NewsletterSchema),
    {
      actionProps: {
        onError: ({ error }) => {
          toast.error(getActionErrorMessage(error, subscribeFailedMessage))
        },
      },
      formProps: {
        defaultValues: {
          email: '',
        },
      },
    }
  )

  return (
    <Form {...form}>
      <form
        className='flex-1 space-y-4'
        noValidate
        onSubmit={handleSubmitWithAction}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='sr-only'>Email address</FormLabel>
              <div className='flex h-10 overflow-hidden rounded-md border bg-muted transition-[color,box-shadow] has-[[aria-invalid=true]:focus-visible]:border-destructive has-[[aria-invalid=true]]:border-destructive has-[input:focus-visible]:border-ring has-[[aria-invalid=true]:focus-visible]:ring-destructive/20 has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-ring/50 dark:has-[[aria-invalid=true]:focus-visible]:border-destructive/50 dark:has-[[aria-invalid=true]]:border-destructive/50 dark:has-[[aria-invalid=true]:focus-visible]:ring-destructive/40'>
                <FormControl>
                  <Input
                    {...field}
                    autoComplete='email'
                    className='h-full flex-1 rounded-none border-none px-4 shadow-none focus-visible:ring-0 aria-invalid:ring-0'
                    disabled={action.isExecuting}
                    placeholder='Email address'
                    type='email'
                  />
                </FormControl>
                <Button
                  aria-label='Subscribe'
                  className='size-auto w-15 rounded-none px-3'
                  disabled={action.isExecuting}
                  focusableWhenDisabled
                  size='icon'
                  type='submit'
                >
                  {action.isExecuting ? (
                    <Icons.spinner className='size-4 animate-spin' />
                  ) : (
                    <Icons.send className='size-4 -translate-x-[3px] rotate-45 transition-transform group-hover/button:rotate-0' />
                  )}
                </Button>
              </div>
              <FieldErrorAlert />
            </FormItem>
          )}
        />

        {action.hasSucceeded && (
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
              {getActionErrorMessage(action.result, subscribeFailedMessage)}
            </AlertTitle>
          </Alert>
        )}
      </form>
    </Form>
  )
}
