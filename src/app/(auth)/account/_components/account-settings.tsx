'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { format, formatDistanceToNow } from 'date-fns'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { UserAvatar } from '@/components/features/auth'
import { Icons } from '@/components/icons/icons'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { authClient, type User } from '@/lib/auth-client'
import { toast } from '@/lib/toast'
import { type Account, AccountSchema } from '@/lib/validators/account'
import { AccountField } from './account-field'

interface AccountSettingsProps {
  user: User
}

export function AccountSettings({ user }: AccountSettingsProps) {
  return (
    <Card className='dashed-stack rounded-none border-0' variant='flat'>
      <div className='flex items-center justify-between p-4 sm:p-6'>
        <AccountField label='Avatar'>
          <UserAvatar className='size-16' user={user} />
        </AccountField>
      </div>

      <div className='flex items-center justify-between p-4 sm:p-6'>
        <AccountField label='Display name'>
          <span className='text-sm'>{user.name || 'No name set'}</span>
        </AccountField>
        <EditNameDialog name={user.name} />
      </div>

      <div className='p-4 sm:p-6'>
        <AccountField label='Email'>
          <span className='text-sm'>{user.email}</span>
        </AccountField>
      </div>

      <div className='p-4 sm:p-6'>
        <AccountField label='Account created'>
          <span className='text-sm'>{formatAccountDate(user.createdAt)}</span>
        </AccountField>
      </div>
    </Card>
  )
}

function EditNameDialog({ name }: { name: string }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const form = useForm<Account>({
    defaultValues: {
      name,
    },
    resolver: zodResolver(AccountSchema),
  })

  const onSubmit = async (values: Account) => {
    const { error } = await authClient.updateUser({
      name: values.name,
    })

    if (error) {
      toast.error(
        "Your display name wasn't saved. Check your connection and try again."
      )
      return
    }

    toast.success('Display name updated')
    setOpen(false)
    router.refresh()
  }

  return (
    <AlertDialog
      onOpenChange={(value) => {
        setOpen(value)
        if (value) {
          form.reset({ name })
        }
      }}
      open={open}
    >
      <AlertDialogTrigger
        render={
          <Button
            aria-label='Edit display name'
            shape='square'
            size='sm'
            variant='secondary'
          />
        }
      >
        Edit
      </AlertDialogTrigger>
      <AlertDialogContent className='dashed-frame rounded-none shadow-none ring-0'>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit display name</AlertDialogTitle>
          <AlertDialogDescription>
            Enter your full name, or a display name you are comfortable with.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form
            className='space-y-4'
            id='edit-name-form'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display name</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete='nickname'
                      className='rounded-none'
                      // TODO(slopradar): magic-string: 32 duplicates AccountSchema's max, export the limit like CONTACT_NAME_MAX_LENGTH
                      maxLength={32}
                      placeholder='Jane Smith'
                      {...field}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={form.formState.isSubmitting}
            shape='square'
            variant='secondary'
          >
            Cancel
          </AlertDialogCancel>
          <Button
            disabled={form.formState.isSubmitting}
            focusableWhenDisabled
            form='edit-name-form'
            shape='square'
            type='submit'
          >
            {form.formState.isSubmitting && (
              <Icons.spinner className='size-4 animate-spin' />
            )}
            Save
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function formatAccountDate(date: Date) {
  const absoluteDate = format(date, 'MMMM d, yyyy')
  const relativeDate = formatDistanceToNow(date, { addSuffix: true })

  return `${absoluteDate} (${relativeDate})`
}
