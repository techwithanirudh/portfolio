'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks'
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
import { Textarea } from '@/components/ui/textarea'
import { pages } from '@/constants/pages'
import { useSession } from '@/lib/auth-client'
import { getActionErrorMessage } from '@/lib/safe-action/error-message'
import { toast } from '@/lib/toast'
import { GuestbookEntrySchema } from '@/lib/validators/guestbook'
import type { SessionUser } from '@/server/auth'
import { createGuestbookEntry } from '../actions/guestbook'

const postFailedMessage =
  "Your entry wasn't posted. Check your connection and try again."

export const GuestbookForm = ({
  initialUser,
}: {
  initialUser: SessionUser | null
}) => {
  const { openSignIn } = useSignInModal()
  const { data: session, isPending } = useSession()
  // The server's user stands in until the client's first session check settles
  const [checked, setChecked] = useState(false)
  if (!(isPending || checked)) {
    setChecked(true)
  }
  const user = checked ? session?.user : initialUser
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
          toast.success('Guestbook entry posted')
          form.reset({
            message: '',
            signature: undefined,
          })
          setStep(1)
          setFormKey((current) => current + 1)
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

  if (!user) {
    return (
      <div className='w-full space-y-6'>
        <div className='grid gap-2'>
          <Label>Message</Label>
          <div className='flex h-40 items-center justify-center rounded-md border border-input bg-background px-4 text-center'>
            <p className='text-muted-foreground text-sm'>
              Sign in to leave a guestbook entry.
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
                <Button
                  className='flex-1'
                  disabled={isExecuting}
                  focusableWhenDisabled
                  type='submit'
                >
                  {isExecuting ? (
                    <Icons.spinner className='size-4 animate-spin' />
                  ) : null}
                  Post entry
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
