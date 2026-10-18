'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { signOut, useSession } from '@/lib/auth-client'
import { cn } from '@/lib/utils'

import { useSignInModal } from './sign-in-modal'
import { UserAvatar } from './user-avatar'

interface UserButtonProps {
  className?: string
}

export function UserButton({ className }: UserButtonProps) {
  const router = useRouter()
  const { openSignIn } = useSignInModal()
  const { data: sessionData, isPending } = useSession()
  const user = sessionData?.user ?? null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className='rounded-md'
        render={
          <Button
            aria-label='User menu'
            className='size-auto rounded-md border border-border bg-background p-0 hover:bg-accent'
            disabled={isPending}
            variant='ghost'
          />
        }
      >
        {isPending ? (
          <Skeleton className={cn('size-8 rounded-md', className)} />
        ) : (
          <UserAvatar className={cn('size-8', className)} user={user} />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align='start'
        className='w-fit min-w-56 max-w-64'
        side='top'
      >
        {user ? (
          <div className='flex items-center gap-2 p-2'>
            <UserAvatar user={user} />

            <div className='flex flex-col truncate'>
              <div className='truncate font-medium text-sm'>
                {user.name || user.email}
              </div>

              {user.name && (
                <div className='truncate text-muted-foreground text-xs'>
                  {user.email}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className='px-2 py-1 text-muted-foreground text-xs'>Account</div>
        )}

        <DropdownMenuSeparator />

        {user ? (
          <>
            {/* TODO(slopradar): duplication: icon plus label are placed by hand, DropdownMenuIconItem icon={...} (page-actions.tsx uses it) does it, and '/account' restates the route (x3 in this file) */}
            <DropdownMenuItem render={<Link href='/account' />}>
              <Icons.user className='size-4' />
              Account
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={async () => {
                await signOut()
                router.refresh()
              }}
            >
              <Icons.logOut className='size-4' />
              Log out
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem onClick={() => openSignIn()}>
            <Icons.logIn className='size-4' />
            Sign in
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
