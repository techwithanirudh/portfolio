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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/lib/toast'
import { cn } from '@/lib/utils'
import { ContactSchema } from '@/lib/validators/contact'
import { contact } from '../actions/contact'

// Fields sit flush in the grid as ruled rows. Placeholders carry the meaning,
// so labels are screen-reader only and the only hint row is an error
const fieldClassName = 'gap-0 border-line border-b'
const labelClassName = 'sr-only'
const inputClassName =
  'h-12 rounded-none border-0 bg-transparent px-4 shadow-none transition-colors field-focus focus-visible:ring-0 aria-invalid:ring-0 dark:bg-transparent'
const hintClassName = 'border-line border-t px-4 py-2 text-xs'

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
            <FormItem className={fieldClassName}>
              <FormLabel className={labelClassName}>Name</FormLabel>
              <FormControl>
                <Input
                  className={inputClassName}
                  placeholder='Jane Smith'
                  {...field}
                  disabled={action.status === 'executing'}
                />
              </FormControl>
              <FormMessage className={hintClassName} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem className={fieldClassName}>
              <FormLabel className={labelClassName}>Email address</FormLabel>
              <FormControl>
                <Input
                  className={inputClassName}
                  placeholder='jane@acme.com'
                  {...field}
                  disabled={action.status === 'executing'}
                />
              </FormControl>
              <FormMessage className={hintClassName} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='message'
          render={({ field }) => (
            <FormItem className={fieldClassName}>
              <FormLabel className={labelClassName}>Message</FormLabel>
              <FormControl>
                <Textarea
                  className={cn(
                    inputClassName,
                    'max-h-[20rem] min-h-[10rem] resize-y py-3'
                  )}
                  placeholder="Hi there, I'm interested in..."
                  {...field}
                  disabled={action.status === 'executing'}
                />
              </FormControl>
              <FormMessage className={hintClassName} />
            </FormItem>
          )}
        />
        <Button
          className='h-auto w-full py-5 ring-0 focus-visible:outline-primary-foreground focus-visible:-outline-offset-4 active:scale-100 active:opacity-90'
          disabled={action.status === 'executing'}
          shape='square'
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
          <Alert className='rounded-none border-0 border-emerald-500/15 border-line border-t bg-emerald-500/15 px-3 py-2 text-emerald-500 has-[>svg]:gap-x-1.5'>
            <Icons.success size={16} />
            <AlertTitle className='mb-0 leading-normal'>
              {action.result.data?.success && action.result.data?.message
                ? action.result.data.message
                : "Thanks, I got your message. I'll reply soon."}
            </AlertTitle>
          </Alert>
        )}
        {action.result.serverError && (
          <Alert className='rounded-none border-0 border-destructive/15 border-line border-t bg-destructive/15 px-3 py-2 text-destructive has-[>svg]:gap-x-1.5 dark:border-destructive dark:bg-destructive dark:text-destructive-foreground'>
            <Icons.warning className='size-4' />
            <AlertTitle className='mb-0 leading-normal'>
              {typeof action.result.serverError === 'string'
                ? action.result.serverError
                : 'Your message failed to send. Please try again.'}
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
