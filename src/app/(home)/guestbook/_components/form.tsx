'use client'

import { useAuthenticate } from '@daveyplate/better-auth-ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
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
import { Textarea } from '@/components/ui/textarea'
import { useSession } from '@/lib/auth-client'
import { GuestbookEntrySchema } from '@/lib/validators'
import { createGuestbookEntry } from '../actions/guestbook'

export const GuestbookForm = () => {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const user = session?.user
  const [authenticate, setAuthenticate] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)
  const signaturePad = useRef<SignaturePadHandle>(null)

  useAuthenticate({
    enabled: authenticate,
  })

  const { form, action, handleSubmitWithAction } = useHookFormAction(
    createGuestbookEntry,
    zodResolver(GuestbookEntrySchema),
    {
      actionProps: {
        onSuccess: () => {
          form.reset()
          setStep(1)
          signaturePad.current?.clear()
          router.refresh()
        },
      },
      formProps: {
        mode: 'onBlur',
        defaultValues: {
          message: '',
          signature: undefined,
        },
      },
      errorMapProps: {},
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
      <div className='flex size-full w-full flex-col items-center justify-center text-muted-foreground text-sm'>
        <Icons.spinner className='size-4 animate-spin' />
      </div>
    )
  }

  if (!(user || isPending)) {
    return (
      <div className='flex w-full flex-col gap-4 text-center'>
        <p className='text-muted-foreground text-sm'>
          Sign in to leave a guestbook message.
        </p>
        <Button className='w-full' onClick={() => setAuthenticate(true)}>
          Sign in to post
        </Button>
      </div>
    )
  }

  const isExecuting = action.status === 'executing'

  return (
    <Form {...form}>
      <form className='flex-1 space-y-6' onSubmit={handleSubmitWithAction}>
        {step === 1 && (
          <>
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
                      placeholder='Say hello...'
                      {...field}
                    />
                  </FormControl>
                  {form.formState.errors.message ? (
                    <FormMessage />
                  ) : (
                    <FormDescription>
                      Posting as {user?.name ?? 'Guest'}.
                    </FormDescription>
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
              Next{' '}
              <Icons.arrowRight className='size-4 transition-transform group-hover:-rotate-45' />
            </Button>
          </>
        )}
        {step === 2 && (
          <>
            <FormItem>
              <FormLabel>Signature</FormLabel>
              <SignaturePad
                disabled={isExecuting}
                onChange={(dataUrl) => form.setValue('signature', dataUrl)}
                onClear={() => form.setValue('signature', undefined)}
                ref={signaturePad}
              />
              <FormDescription>
                Draw your signature with your mouse or finger.
              </FormDescription>
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
                  <Icons.spinner className='mr-2 size-4 animate-spin' />
                ) : null}
                Submit
              </Button>
            </div>
          </>
        )}
        {action.status === 'hasSucceeded' && (
          <Alert className='border-emerald-500/15 bg-emerald-500/15 p-3 px-3 py-2 text-emerald-500 has-[>svg]:gap-x-1.5'>
            <Icons.success size={16} />
            <AlertTitle className='mb-0 leading-normal'>
              Thanks for signing the guestbook!
            </AlertTitle>
          </Alert>
        )}
        {action.result.serverError && (
          <Alert className='border-destructive/15 bg-destructive/15 p-3 px-3 py-2 text-destructive has-[>svg]:gap-x-1.5 dark:border-destructive dark:bg-destructive dark:text-destructive-foreground'>
            <Icons.warning className='size-4' />
            <AlertTitle className='mb-0 leading-normal'>
              {action.result.serverError}
            </AlertTitle>
          </Alert>
        )}
      </form>
    </Form>
  )
}
