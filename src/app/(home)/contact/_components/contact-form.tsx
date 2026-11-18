'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks'
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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { getActionErrorMessage } from '@/lib/safe-action/error-message'
import { toast } from '@/lib/toast'
import {
  CONTACT_MESSAGE_MAX_LENGTH,
  CONTACT_MESSAGE_MIN_LENGTH,
  CONTACT_NAME_MAX_LENGTH,
  ContactSchema,
} from '@/lib/validators/contact'
import { contact } from '../actions/contact'

const sendFailedMessage =
  "Your message didn't send. Check your connection and try again."

// No Suspense boundary: React streams boundaries over 500 bytes out of line and
// reveals them after first paint, which shifted the FAQ (CLS 0.32 on mobile)
export const ContactForm = () => {
  const { form, action, handleSubmitWithAction } = useHookFormAction(
    contact,
    zodResolver(ContactSchema),
    {
      actionProps: {
        onError: ({ error }) => {
          toast.error(getActionErrorMessage(error, sendFailedMessage))
        },
        onSuccess: ({ data }) => {
          toast.success(data.message)
        },
      },
      formProps: {
        defaultValues: {
          email: '',
          message: '',
          name: '',
        },
        mode: 'onBlur',
      },
    }
  )

  return (
    <Form {...form}>
      <form
        className='flex-1 space-y-8'
        noValidate
        onSubmit={handleSubmitWithAction}
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  autoComplete='name'
                  className='bg-background'
                  maxLength={CONTACT_NAME_MAX_LENGTH}
                  placeholder='Jane Smith'
                  {...field}
                  disabled={action.isExecuting}
                />
              </FormControl>
              {form.formState.errors.name ? (
                <FormMessage />
              ) : (
                <FormDescription>
                  Your full name, so I know who I'm talking to.
                </FormDescription>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input
                  autoComplete='email'
                  className='bg-background'
                  placeholder='jane@example.com'
                  {...field}
                  disabled={action.isExecuting}
                  type='email'
                />
              </FormControl>
              {form.formState.errors.email ? (
                <FormMessage />
              ) : (
                <FormDescription>
                  I won't share your email with anyone.
                </FormDescription>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='message'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  className='max-h-[20rem] min-h-[10rem] resize-y bg-background'
                  maxLength={CONTACT_MESSAGE_MAX_LENGTH}
                  placeholder="Hi there, I'm interested in…"
                  {...field}
                  disabled={action.isExecuting}
                />
              </FormControl>
              {form.formState.errors.message ? (
                <FormMessage />
              ) : (
                <FormDescription>
                  {`Use at least ${CONTACT_MESSAGE_MIN_LENGTH} characters.`}
                </FormDescription>
              )}
            </FormItem>
          )}
        />
        <Button
          className='w-full'
          disabled={action.isExecuting}
          focusableWhenDisabled
          type='submit'
        >
          <span>Send message</span>
          {action.isExecuting ? (
            <Icons.spinner
              className='size-4 animate-spin'
              data-icon='inline-end'
            />
          ) : (
            <Icons.send
              className='size-4 rotate-45 transition-transform group-hover/button:rotate-0'
              data-icon='inline-end'
            />
          )}
        </Button>
        {action.hasSucceeded && (
          <Alert variant='success'>
            <Icons.success size={16} />
            <AlertTitle className='mb-0 leading-normal'>
              {action.result.data?.message}
            </AlertTitle>
          </Alert>
        )}
        {action.result.serverError && (
          <Alert variant='destructive-soft'>
            <Icons.warning className='size-4' />
            <AlertTitle className='mb-0 leading-normal'>
              {getActionErrorMessage(action.result, sendFailedMessage)}
            </AlertTitle>
          </Alert>
        )}
      </form>
    </Form>
  )
}
