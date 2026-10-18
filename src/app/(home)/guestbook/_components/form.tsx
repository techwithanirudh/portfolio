'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks'
import { useRouter } from 'next/navigation'
import { Activity, useState } from 'react'
import { useSignInModal } from '@/components/features/auth/sign-in-modal'
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
import { Label } from '@/components/ui/label'
import { SignaturePad } from '@/components/ui/signature-pad'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { pages } from '@/constants/pages'
import { useSession } from '@/lib/auth-client'
import { getActionErrorMessage } from '@/lib/safe-action/error-message'
import { toast } from '@/lib/toast'
import { GuestbookEntrySchema } from '@/lib/validators'
import { createGuestbookEntry } from '../actions/guestbook'

const postFailedMessage =
  "Your entry wasn't posted. Check your connection and try again."

export const GuestbookForm = () => {
  const router = useRouter()
  const { openSignIn } = useSignInModal()
  const { data: session, isPending } = useSession()
  const user = session?.user
  const [step, setStep] = useState<1 | 2>(1)
  const [formKey, setFormKey] = useState(0)

  const { form, action, handleSubmitWithAction } = useHookFormAction(
    createGuestbookEntry,
    zodResolver(GuestbookEntrySchema),
    {
      actionProps: {
        onError: ({ error }) => {
          if (form.formState.errors.message) {
            setStep(1)
          }
          toast.error(getActionErrorMessage(error, postFailedMessage))
        },
        onSuccess: () => {
          toast.success('Guestbook entry posted.')
          form.reset({
            message: '',
            signature: undefined,
          })
          setStep(1)
          setFormKey((current) => current + 1)
          // TODO(slopradar): redundant-refresh: the action calls updateTag, which already re-renders the route in the action response (next docs 02-guides/server-actions.md), so router.refresh() is a second round trip, drop it (x3 in use-entry-actions.ts)
          router.refresh()
        },
      },
      formProps: {
        defaultValues: {
          message: '',
          signature: undefined,
        },
        mode: 'onBlur',
      },
    }
  )

  const goToNextStep = async () => {
    const valid = await form.trigger('message')
    if (valid) {
      setStep(2)
    }
  }

  if (isPending) {
    return (
      <div className='w-full space-y-6'>
        <div className='grid gap-2'>
          <Skeleton className='h-3.5 w-16' />
          <Skeleton className='h-40 w-full' />
          <Skeleton className='h-5 w-36' />
        </div>
        <Skeleton className='h-9 w-full' />
      </div>
    )
  }

  if (!user) {
    return (
      <div className='w-full space-y-6'>
        <div className='grid gap-2'>
          <Label>Message</Label>
          <div className='flex h-40 items-center justify-center rounded-md border border-input bg-background px-4 text-center'>
            <p className='text-muted-foreground text-sm'>
              Sign in to leave a guestbook message.
            </p>
          </div>
          <p className='text-muted-foreground text-sm'>
            You need an account to post.
          </p>
        </div>
        <Button
          className='w-full'
          onClick={() => openSignIn(pages.guestbook.path)}
        >
          <span>Sign in to post</span>
          <Icons.arrowRight
            className='icon-arrow-button size-4'
            data-icon='inline-end'
          />
        </Button>
      </div>
    )
  }

  const { isExecuting } = action

  return (
    <div className='w-full'>
      <Form {...form}>
        <form
          className='flex-1'
          key={formKey}
          onSubmit={handleSubmitWithAction}
        >
          <Activity mode={step === 1 ? 'visible' : 'hidden'}>
            <div className='space-y-6'>
              <FormField
                control={form.control}
                name='message'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        className='min-h-[10rem] resize-y bg-background'
                        disabled={isExecuting}
                        placeholder='Say hello…'
                        {...field}
                      />
                    </FormControl>
                    {form.formState.errors.message ? (
                      <FormMessage />
                    ) : (
                      <FormDescription>Posting as {user.name}.</FormDescription>
                    )}
                  </FormItem>
                )}
              />
              <Button
                className='w-full'
                disabled={isExecuting}
                onClick={goToNextStep}
                type='button'
              >
                <span>Next</span>
                <Icons.arrowRight
                  className='icon-arrow-button size-4'
                  data-icon='inline-end'
                />
              </Button>
            </div>
          </Activity>
          <Activity mode={step === 2 ? 'visible' : 'hidden'}>
            <div className='space-y-6'>
              <FormItem>
                <FormLabel>Signature</FormLabel>
                <SignaturePad
                  disabled={isExecuting}
                  onChange={(dataUrl) => form.setValue('signature', dataUrl)}
                  onClear={() => form.setValue('signature', undefined)}
                />
              </FormItem>
              <div className='flex gap-2'>
                <Button
                  className='flex-1'
                  disabled={isExecuting}
                  onClick={() => setStep(1)}
                  type='button'
                  variant='secondary'
                >
                  <Icons.arrowLeft className='size-4' />
                  Back
                </Button>
                <Button className='flex-1' disabled={isExecuting} type='submit'>
                  {isExecuting ? (
                    <Icons.spinner className='size-4 animate-spin' />
                  ) : null}
                  Submit
                </Button>
              </div>
            </div>
          </Activity>
          {action.hasSucceeded && (
            <Alert className='mt-6' variant='success'>
              <Icons.success size={16} />
              <AlertTitle className='mb-0 leading-normal'>
                Thanks for signing the guestbook!
              </AlertTitle>
            </Alert>
          )}
          {action.result.serverError && (
            <Alert className='mt-6' variant='destructive-soft'>
              <Icons.warning className='size-4' />
              <AlertTitle className='mb-0 leading-normal'>
                {getActionErrorMessage(action.result, postFailedMessage)}
              </AlertTitle>
            </Alert>
          )}
        </form>
      </Form>
    </div>
  )
}
