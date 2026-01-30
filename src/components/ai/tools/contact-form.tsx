'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks'
import { CheckCircle, Loader2, Send } from 'lucide-react'
import { contact } from '@/app/(home)/contact/actions/contact'
import { useChatContext } from '@/components/ai/chat'
import { Icons } from '@/components/icons/icons'
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
import type { Contact } from '@/lib/validators/contact'
import { ContactSchema } from '@/lib/validators/contact'

interface AIContactFormProps {
  toolCallId: string
  prefill?: Partial<Contact>
  isSubmitted: boolean
  submittedData?: Contact
}

export function AIContactForm({
  toolCallId,
  prefill,
  isSubmitted,
  submittedData,
}: AIContactFormProps) {
  const { addToolOutput, sendMessage } = useChatContext()

  const { form, action, handleSubmitWithAction } = useHookFormAction(
    contact,
    zodResolver(ContactSchema),
    {
      actionProps: {
        onSuccess: () => {
          const { name, email, message } = form.getValues()
          addToolOutput({
            tool: 'showContactForm',
            toolCallId,
            output: {
              success: true,
              name,
              email,
              message,
            },
          })
          sendMessage()
        },
      },
      formProps: {
        mode: 'onBlur',
        defaultValues: {
          name: prefill?.name ?? '',
          email: prefill?.email ?? '',
          message: prefill?.message ?? '',
        },
      },
      errorMapProps: {},
    }
  )

  const isExecuting = action.status === 'executing'

  if (isSubmitted && submittedData) {
    return (
      <div className='flex flex-col gap-2 rounded-md border border-green-500/50 border-dashed bg-green-500/10 p-3 text-green-600 text-sm dark:text-green-400'>
        <div className='flex items-center gap-2'>
          <CheckCircle className='size-4 shrink-0' />
          <p>message sent! anirudh will get back to you soon.</p>
        </div>
        <div className='mt-1 space-y-1 text-xs opacity-80'>
          <p>
            <span className='font-medium'>from:</span> {submittedData.name} (
            {submittedData.email})
          </p>
          <p>
            <span className='font-medium'>message:</span>{' '}
            {submittedData.message}
          </p>
        </div>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form
        className='flex flex-col gap-3 rounded-md border border-dashed p-3'
        onSubmit={handleSubmitWithAction}
      >
        <p className='text-fd-muted-foreground text-xs'>
          fill this out and i&apos;ll send it to anirudh for you!
        </p>

        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem className='space-y-1'>
              <FormLabel className='text-xs'>name</FormLabel>
              <FormControl>
                <Input
                  className='h-8 text-sm'
                  disabled={isExecuting}
                  placeholder='your name'
                  {...field}
                />
              </FormControl>
              <FormMessage className='text-xs' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem className='space-y-1'>
              <FormLabel className='text-xs'>email</FormLabel>
              <FormControl>
                <Input
                  className='h-8 text-sm'
                  disabled={isExecuting}
                  placeholder='you@example.com'
                  type='email'
                  {...field}
                />
              </FormControl>
              <FormMessage className='text-xs' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='message'
          render={({ field }) => (
            <FormItem className='space-y-1'>
              <FormLabel className='text-xs'>message</FormLabel>
              <FormControl>
                <Textarea
                  className='min-h-20 resize-none text-sm'
                  disabled={isExecuting}
                  placeholder='what would you like to tell anirudh?'
                  {...field}
                />
              </FormControl>
              <FormMessage className='text-xs' />
            </FormItem>
          )}
        />

        {action.result.serverError && (
          <div className='flex items-center gap-2 text-destructive text-xs'>
            <Icons.warning className='size-3.5 shrink-0' />
            <p>
              {typeof action.result.serverError === 'string'
                ? action.result.serverError
                : 'Failed to send message'}
            </p>
          </div>
        )}

        <Button
          className='h-8 gap-1.5 text-sm'
          disabled={isExecuting}
          size='sm'
          type='submit'
        >
          {isExecuting ? (
            <>
              <Loader2 className='size-3.5 animate-spin' />
              sending...
            </>
          ) : (
            <>
              <Send className='size-3.5' />
              send message
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}
