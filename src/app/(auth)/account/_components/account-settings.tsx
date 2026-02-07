'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { UserAvatar } from '@/components/auth/user-avatar'
import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { authClient, useSession } from '@/lib/auth-client'

export function AccountSettings() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const user = session?.user
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)

  if (isPending) {
    return (
      <div className='space-y-6'>
        <Skeleton className='h-48 w-full rounded-md' />
        <Skeleton className='h-32 w-full rounded-md' />
      </div>
    )
  }

  if (!user) {
    return (
      <p className='text-center text-muted-foreground text-sm'>
        Please sign in to view account settings.
      </p>
    )
  }

  const displayName = name || user.name || ''

  const handleSaveName = async () => {
    if (!displayName.trim()) {
      return
    }

    setSaving(true)
    const { error } = await authClient.updateUser({ name: displayName.trim() })
    setSaving(false)

    if (error) {
      toast.error('Failed to update name.')
      return
    }

    toast.success('Name updated successfully.')
    router.refresh()
  }

  return (
    <div className='space-y-6'>
      <Card className='rounded-none border-dashed'>
        <CardHeader>
          <div className='flex items-center gap-3'>
            <UserAvatar className='size-12' user={user} />
            <div>
              <CardTitle className='text-base'>
                {user.name || 'No name set'}
              </CardTitle>
              <CardDescription className='text-xs'>
                {user.email}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className='rounded-none border-dashed'>
        <CardHeader>
          <CardTitle className='text-base'>Name</CardTitle>
          <CardDescription className='text-xs'>
            Please enter your full name, or a display name.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Label className='sr-only' htmlFor='name'>
            Name
          </Label>
          <Input
            className='rounded-none'
            defaultValue={user.name ?? ''}
            id='name'
            maxLength={32}
            onChange={(e) => setName(e.target.value)}
            placeholder='Your name'
          />
          <p className='mt-1 text-muted-foreground text-xs'>
            Please use 32 characters at maximum.
          </p>
        </CardContent>
        <CardFooter className='border-border border-t border-dashed px-6 py-3'>
          <Button
            className='ml-auto rounded-none'
            disabled={saving || !displayName.trim()}
            onClick={handleSaveName}
            size='sm'
          >
            {saving && <Icons.spinner className='size-4 animate-spin' />}
            Save
          </Button>
        </CardFooter>
      </Card>

      <Card className='rounded-none border-dashed'>
        <CardHeader>
          <CardTitle className='text-base'>Email</CardTitle>
          <CardDescription className='text-xs'>
            Enter the email address you want to use to log in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Label className='sr-only' htmlFor='email'>
            Email
          </Label>
          <Input
            className='rounded-none'
            defaultValue={user.email}
            disabled
            id='email'
            type='email'
          />
        </CardContent>
      </Card>
    </div>
  )
}
