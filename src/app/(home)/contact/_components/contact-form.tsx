'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks'
import { Suspense } from 'react'
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
  flushHintClassName,
  flushItemClassName,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/lib/toast'
import { ContactSchema } from '@/lib/validators/contact'
import { contact } from '../actions/contact'

// Placeholders carry the meaning, so labels are screen-reader only and the
// only hint row is an error

const ContactFormInner = () => {
  const { form, action, handleSubmitWithAction } = useHookFormAction(
    contact,
    zodResolver(ContactSchema),
    {
      actionProps: {
        onError: ({ error }) => {
          toast.error(
            typeof error.serverError === 'string'
              ? error.serverError
              : 'Your message failed to send. Please try again.'
          )
        },
        onSuccess: ({ data }) => {
          toast.success(
            data?.success && data.message
              ? data.message
              : "Thanks, I got your message. I'll reply soon."
          )
        },
      },
      errorMapProps: {},
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
      <form className='flex flex-col' onSubmit={handleSubmitWithAction}>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem className={flushItemClassName}>
              <FormLabel className='sr-only'>Name</FormLabel>
              <FormControl>
                <Input
                  autoComplete='name'
                  placeholder='Jane Smith'
                  variant='flush'
                  {...field}
                  disabled={action.status === 'executing'}
                />
              </FormControl>
              <FormMessage className={flushHintClassName} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem className={flushItemClassName}>
              <FormLabel className='sr-only'>Email address</FormLabel>
              <FormControl>
                <Input
                  autoComplete='email'
                  placeholder='jane@acme.com'
                  type='email'
                  variant='flush'
                  {...field}
                  disabled={action.status === 'executing'}
                />
              </FormControl>
              <FormMessage className={flushHintClassName} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='message'
          render={({ field }) => (
            <FormItem className={flushItemClassName}>
              <FormLabel className='sr-only'>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Hi there, I'm interested in..."
                  variant='flush'
                  {...field}
                  disabled={action.status === 'executing'}
                />
              </FormControl>
              <FormMessage className={flushHintClassName} />
            </FormItem>
          )}
        />
        <Button
          className='h-auto w-full py-5 ring-0 focus-visible:outline-primary-foreground focus-visible:-outline-offset-4 active:scale-100 active:opacity-90'
          disabled={action.status === 'executing'}
          type='submit'
        >
          <span>Send Message</span>
          {action.status === 'executing' ? (
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
        {action.status === 'hasSucceeded' && (
          <FormStatus variant='success'>
            {action.result.data?.success && action.result.data?.message
              ? action.result.data.message
              : "Thanks, I got your message. I'll reply soon."}
          </FormStatus>
        )}
        {action.result.serverError && (
          <FormStatus variant='error'>
            {typeof action.result.serverError === 'string'
              ? action.result.serverError
              : 'Your message failed to send. Please try again.'}
          </FormStatus>
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
