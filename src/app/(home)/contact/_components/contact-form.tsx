'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks'
import { Suspense } from 'react'
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
import { ContactSchema } from '@/lib/validators/contact'
import { contact } from '../actions/contact'

const ContactFormInner = () => {
  const { form, action, handleSubmitWithAction } = useHookFormAction(
    contact,
    zodResolver(ContactSchema),
    {
      actionProps: {},
      formProps: {
        mode: 'onBlur',
        defaultValues: {
          name: '',
          email: '',
          message: '',
        },
      },
      errorMapProps: {},
    }
  )

  return (
    <Form {...form}>
      <form className='flex-1 space-y-8' onSubmit={handleSubmitWithAction}>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  className='bg-background'
                  placeholder='Jane Smith'
                  {...field}
                  disabled={action.status === 'executing'}
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
                  className='bg-background'
                  placeholder='jane@acme.com'
                  {...field}
                  disabled={action.status === 'executing'}
                />
              </FormControl>
              {form.formState.errors.email ? (
                <FormMessage />
              ) : (
                <FormDescription>
                  I will never share your email with anyone else.
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
                  placeholder="Hi there, I'm interested in..."
                  {...field}
                  disabled={action.status === 'executing'}
                />
              </FormControl>
              {form.formState.errors.message ? (
                <FormMessage />
              ) : (
                <FormDescription>
                  Please include at least 30 characters.
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
            <Icons.spinner className='size-4 animate-spin' />
          ) : null}
          Send Message
        </Button>
        {action.status === 'hasSucceeded' && (
          <Alert className='border-emerald-500/15 bg-emerald-500/15 p-3 px-3 py-2 text-emerald-500 has-[>svg]:gap-x-1.5'>
            <Icons.success size={16} />
            <AlertTitle className='mb-0 leading-normal'>
              {action.result.data?.success && action.result.data?.message
                ? action.result.data.message
                : "Your message has been sent! We'll get back to you soon."}
            </AlertTitle>
          </Alert>
        )}
        {action.result.serverError && (
          <Alert className='border-destructive/15 bg-destructive/15 p-3 px-3 py-2 text-destructive has-[>svg]:gap-x-1.5 dark:border-destructive dark:bg-destructive dark:text-destructive-foreground'>
            <Icons.warning className='size-4' />
            <AlertTitle className='mb-0 leading-normal'>
              {typeof action.result.serverError === 'string'
                ? action.result.serverError
                : 'An error occurred while sending your message.'}
            </AlertTitle>
          </Alert>
        )}
      </form>
    </Form>
  )
}

export const ContactForm = () => (
  <Suspense>
    <ContactFormInner />
  </Suspense>
)
