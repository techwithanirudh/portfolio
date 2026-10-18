'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks'
import { useSound } from '@web-kits/audio/react'
// TODO(slopradar): layering: the shared assistant imports the server action from app/(home)/contact/actions, move contact into src/server since two features own it
import { contact } from '@/app/(home)/contact/actions/contact'
import { useChatContext } from '@/components/features/assistant/chat-context'
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
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { error, pop } from '@/lib/audio/minimal'
import { getActionErrorMessage } from '@/lib/safe-action/error-message'
import type { Contact } from '@/lib/validators/contact'
import { ContactSchema } from '@/lib/validators/contact'
import { ownerName } from '../owner-name'

export function ContactFormSent({ data }: { data: Contact }) {
  return (
    <div className='flex flex-col gap-2 bg-success/10 p-3 text-sm text-success'>
      <div className='flex items-center gap-2'>
        <Icons.success className='size-4 shrink-0' />
        <p>{`message sent! ${ownerName} will get back to you soon.`}</p>
      </div>
      <div className='mt-1 space-y-1 text-xs opacity-80'>
        <p>
          <span className='font-medium'>from:</span> {data.name} ({data.email})
        </p>
        <p>
          <span className='font-medium'>message:</span> {data.message}
        </p>
      </div>
    </div>
  )
}

export function ContactFormCanceled() {
  return (
    <div className='flex flex-col gap-2 bg-muted/40 p-3 text-muted-foreground text-sm'>
      <div className='flex items-center gap-2'>
        <Icons.info className='size-4 shrink-0' />
        <p>message canceled. you can keep chatting.</p>
      </div>
    </div>
  )
}

export function ContactForm({
  toolCallId,
  prefill,
}: {
  prefill?: Partial<Contact>
  toolCallId: string
}) {
  const { addToolOutput, sendMessage } = useChatContext()
  const playPop = useSound(pop)
  const playError = useSound(error)

  const { form, action, handleSubmitWithAction } = useHookFormAction(
    contact,
    zodResolver(ContactSchema),
    {
      actionProps: {
        onError: () => {
          playError()
        },
        onSuccess: () => {
          playPop()
          const { name, email, message } = form.getValues()
          addToolOutput({
            output: {
              email,
              message,
              name,
              success: true,
            },
            tool: 'showContactForm',
            toolCallId,
          })
          sendMessage()
        },
      },
      formProps: {
        defaultValues: {
          email: prefill?.email ?? '',
          message: prefill?.message ?? '',
          name: prefill?.name ?? '',
        },
        mode: 'onBlur',
      },
    }
  )

  const isExecuting = action.status === 'executing'

  const handleCancel = () => {
    addToolOutput({
      output: {
        reason: 'user canceled the form',
        success: false,
      },
      tool: 'showContactForm',
      toolCallId,
    })
    sendMessage()
  }

  return (
    <Form {...form}>
      <form
        className='flex flex-col gap-3 p-3'
        onSubmit={handleSubmitWithAction}
      >
        <p className='text-muted-foreground text-xs'>
          {`fill this out and i'll send it to ${ownerName} for you!`}
        </p>

        {/* TODO(slopradar): duplication: three near-identical FormField blocks, and the same name/email/message fields exist in app/(home)/contact/_components/contact-form.tsx, drive both from one field config */}
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
                  placeholder={`what would you like to tell ${ownerName}?`}
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
              {getActionErrorMessage(
                action.result,
                "Your message didn't send. Try again."
              )}
            </p>
          </div>
        )}

        <div className='flex items-center gap-2'>
          <Button
            // TODO(slopradar): redundant-class: h-8 and gap-1.5 are what size='sm' sets and text-sm is in the button base, so only flex-1 does anything (x2 with the cancel button's h-8 text-sm), drop the repeats
            className='h-8 flex-1 gap-1.5 text-sm'
            disabled={isExecuting}
            size='sm'
            type='submit'
          >
            {isExecuting ? (
              <>
                <Icons.spinner className='size-3.5 animate-spin' />
                sending…
              </>
            ) : (
              <>
                <Icons.send className='size-3.5' />
                send message
              </>
            )}
          </Button>
          <Button
            className='h-8 text-sm'
            disabled={isExecuting}
            onClick={handleCancel}
            size='sm'
            type='button'
            variant='secondary'
          >
            cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}

export function ContactFormSkeleton() {
  return (
    <div className='flex flex-col gap-3 p-3'>
      <Skeleton className='h-3 w-48' />
      <div className='space-y-2'>
        <Skeleton className='h-3 w-12' />
        <Skeleton className='h-8 w-full' />
      </div>
      <div className='space-y-2'>
        <Skeleton className='h-3 w-14' />
        <Skeleton className='h-8 w-full' />
      </div>
      <div className='space-y-2'>
        <Skeleton className='h-3 w-16' />
        <Skeleton className='h-20 w-full' />
      </div>
      <div className='flex items-center gap-2'>
        <Skeleton className='h-8 w-28 flex-1' />
        <Skeleton className='h-8 w-20' />
      </div>
    </div>
  )
}
