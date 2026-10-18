import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { AccountField } from './account-field'

export function AccountSettingsSkeleton() {
  return (
    <Card className='dashed-stack rounded-none border-0' variant='flat'>
      <div className='flex items-center justify-between p-4 sm:p-6'>
        <AccountField label='Avatar'>
          <Skeleton className='size-16 rounded-md' />
        </AccountField>
      </div>

      <div className='flex items-center justify-between gap-6 p-4 sm:p-6'>
        <AccountField label='Display name'>
          <Skeleton className='h-4 w-56' />
        </AccountField>
        <Skeleton className='h-8 w-12.5 rounded-none' />
      </div>

      <div className='p-4 sm:p-6'>
        <AccountField label='Email'>
          <Skeleton className='h-4 w-64' />
        </AccountField>
      </div>

      <div className='p-4 sm:p-6'>
        <AccountField label='Account created'>
          <Skeleton className='h-4 w-44' />
        </AccountField>
      </div>
    </Card>
  )
}
