'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { UserAvatar } from '@/components/auth/user-avatar'
import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
import { type Account, AccountSchema } from '@/lib/validators/account'

interface AccountSettingsProps {
  user: User
}

export function AccountSettings({ user }: AccountSettingsProps) {
  return (
    <Card className='gap-0 divide-y divide-dashed rounded-none border-dashed py-0'>
      <div className='flex items-center justify-between p-4 sm:p-6'>
        <div className='flex flex-col gap-2'>
          <span className='text-muted-foreground text-sm'>Avatar</span>
          <UserAvatar className='size-16' user={user} />
        </div>
      </div>

      <div className='flex items-center justify-between p-4 sm:p-6'>
        <div className='flex flex-col gap-2'>
          <span className='text-muted-foreground text-sm'>Display Name</span>
          <span className='text-sm'>{user.name || 'No name set'}</span>
        </div>
        <EditNameDialog name={user.name ?? ''} />
      </div>

      <div className='p-4 sm:p-6'>
        <div className='flex flex-col gap-2'>
          <span className='text-muted-foreground text-sm'>Email</span>
          <span className='text-sm'>{user.email}</span>
        </div>
      </div>

      <div className='p-4 sm:p-6'>
        <div className='flex flex-col gap-2'>
          <span className='text-muted-foreground text-sm'>Account Created</span>
          <span className='text-sm'>{formatAccountDate(user.createdAt)}</span>
        </div>
      </div>
    </Card>
  )
}

function EditNameDialog({ name }: { name: string }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const form = useForm<Account>({
    resolver: zodResolver(AccountSchema),
    defaultValues: {
      name,
    },
  })

  const onSubmit = async (values: Account) => {
    const { error } = await authClient.updateUser({
      name: values.name.trim(),
    })

    if (error) {
      toast.error('Failed to update name.')
      return
    }

    toast.success('Name updated successfully.')
    setOpen(false)
    router.refresh()
  }

  return (
    <Dialog
      onOpenChange={(value) => {
        setOpen(value)
        if (value) {
          form.reset({ name })
        }
      }}
      open={open}
    >
      <DialogTrigger asChild>
        <Button className='rounded-none' size='sm' variant='secondary'>
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className='rounded-none border-dashed'>
        <DialogHeader>
          <DialogTitle>Edit Name</DialogTitle>
          <DialogDescription>
            Enter your full name, or a display name you are comfortable with.
          </DialogDescription>
        </DialogHeader>
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
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      className='rounded-none'
                      maxLength={32}
                      placeholder='Your name'
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
        <DialogFooter>
          <DialogClose asChild>
            <Button
              className='rounded-none'
              disabled={form.formState.isSubmitting}
              variant='secondary'
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            className='rounded-none'
            disabled={form.formState.isSubmitting}
            form='edit-name-form'
            type='submit'
          >
            {form.formState.isSubmitting && (
              <Icons.spinner className='size-4 animate-spin' />
            )}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function formatAccountDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
