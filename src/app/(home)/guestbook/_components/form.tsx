'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks'
import { useRouter } from 'next/navigation'
import { Activity, useRef, useState } from 'react'
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
import {
  SignaturePad,
  type SignaturePadHandle,
} from '@/components/ui/signature-pad'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { useSession } from '@/lib/auth-client'
import { toast } from '@/lib/toast'
import { cn } from '@/lib/utils'
import { GuestbookEntrySchema } from '@/lib/validators'
import { createGuestbookEntry } from '../actions/guestbook'

// Flush, ruled form to match the contact form
const fieldClassName = 'gap-0 border-line border-b'
const textareaClassName =
  'max-h-[20rem] min-h-[10rem] resize-y rounded-none border-0 bg-transparent px-4 py-3 shadow-none transition-colors field-focus focus-visible:ring-0 aria-invalid:ring-0 dark:bg-transparent'
const hintClassName = 'border-line border-t px-4 py-2 text-xs'
const buttonClassName =
  'h-auto w-full py-5 ring-0 active:scale-100 active:opacity-90 focus-visible:-outline-offset-4 focus-visible:outline-primary-foreground'

export const GuestbookForm = () => {
  const router = useRouter()
  const { openSignIn } = useSignInModal()
  const { data: session, isPending } = useSession()
  const user = session?.user
  const [step, setStep] = useState<1 | 2>(1)
  const [formKey, setFormKey] = useState(0)
  const signaturePad = useRef<SignaturePadHandle>(null)

  const { form, action, handleSubmitWithAction } = useHookFormAction(
    createGuestbookEntry,
    zodResolver(GuestbookEntrySchema),
    {
      actionProps: {
        onError: ({ error }) => {
          if (form.formState.errors.message) {
            setStep(1)
          }
          toast.error(
            typeof error.serverError === 'string'
              ? error.serverError
              : 'Failed to post guestbook entry.'
          )
        },
        onSuccess: () => {
          toast.success('Guestbook entry posted.')
          form.reset({
            message: '',
            signature: undefined,
          })
          setStep(1)
          signaturePad.current?.clear()
          setFormKey((current) => current + 1)
          router.refresh()
        },
      },
      errorMapProps: {},
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
      <div className='flex w-full flex-col'>
        <Skeleton className='h-40 w-full rounded-none' />
        <Skeleton className='h-15 w-full rounded-none border-line border-t' />
      </div>
    )
  }

  if (!(user || isPending)) {
    return (
      <div className='flex w-full flex-col'>
        <div className='flex h-40 items-center justify-center border-line border-b px-4 text-center'>
          <p className='text-muted-foreground text-sm'>
            Sign in to leave a guestbook message.
          </p>
        </div>
        <Button
          className={buttonClassName}
          onClick={() => openSignIn('/guestbook')}
          shape='square'
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

  const isExecuting = action.status === 'executing'

  return (
    <div className='w-full'>
      <Form {...form}>
        <form
          className='flex-1'
          key={formKey}
          onSubmit={handleSubmitWithAction}
        >
          <Activity mode={step === 1 ? 'visible' : 'hidden'}>
            <div className='flex flex-col'>
              <FormField
                control={form.control}
                name='message'
                render={({ field }) => (
                  <FormItem className={fieldClassName}>
                    <FormLabel className='sr-only'>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        className={textareaClassName}
                        disabled={isExecuting}
                        placeholder='Say hello...'
                        {...field}
                      />
                    </FormControl>
                    {form.formState.errors.message ? (
                      <FormMessage className={hintClassName} />
                    ) : (
                      <FormDescription className={hintClassName}>
                        Posting as {user?.name ?? 'Guest'}.
                      </FormDescription>
                    )}
                  </FormItem>
                )}
              />
              <Button
                className={buttonClassName}
                disabled={isExecuting}
                onClick={goToNextStep}
                shape='square'
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
            <div className='flex flex-col'>
              <FormItem className={fieldClassName}>
                <FormLabel className='sr-only'>Signature</FormLabel>
                <SignaturePad
                  className='[&>canvas]:rounded-none [&>canvas]:border-0 [&>canvas]:bg-transparent [&>canvas]:shadow-none'
                  disabled={isExecuting}
                  onChange={(dataUrl) => form.setValue('signature', dataUrl)}
                  onClear={() => form.setValue('signature', undefined)}
                  ref={signaturePad}
                />
              </FormItem>
              <div className='flex'>
                <Button
                  className={cn(buttonClassName, 'flex-1 border-line border-r')}
                  disabled={isExecuting}
                  onClick={() => setStep(1)}
                  shape='square'
                  type='button'
                  variant='secondary'
                >
                  <Icons.arrowLeft className='size-4' />
                  Back
                </Button>
                <Button
                  className={cn(buttonClassName, 'flex-1')}
                  disabled={isExecuting}
                  shape='square'
                  type='submit'
                >
                  {isExecuting ? (
                    <Icons.spinner className='size-4 animate-spin' />
                  ) : null}
                  Submit
                </Button>
              </div>
            </div>
          </Activity>
          {action.status === 'hasSucceeded' && (
            <Alert className='rounded-none border-0 border-emerald-500/15 border-t bg-emerald-500/15 p-3 px-3 py-2 text-emerald-500 has-[>svg]:gap-x-1.5'>
              <Icons.success size={16} />
              <AlertTitle className='mb-0 leading-normal'>
                Thanks for signing the guestbook!
              </AlertTitle>
            </Alert>
          )}
          {action.result.serverError && (
            <Alert className='rounded-none border-0 border-destructive/15 border-t bg-destructive/15 p-3 px-3 py-2 text-destructive has-[>svg]:gap-x-1.5 dark:border-destructive dark:bg-destructive dark:text-destructive-foreground'>
              <Icons.warning className='size-4' />
              <AlertTitle className='mb-0 leading-normal'>
                {action.result.serverError}
              </AlertTitle>
            </Alert>
          )}
        </form>
      </Form>
    </div>
  )
}
