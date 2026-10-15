import { Skeleton } from '@/components/ui/skeleton'

export function AccountSettingsSkeleton() {
  return (
    <div className='divide-y divide-dashed divide-border'>
      <div className='flex items-center justify-between p-6'>
        <div className='flex flex-col gap-2'>
          <span className='text-muted-foreground text-sm'>Avatar</span>
          <Skeleton className='size-16 rounded-md' />
        </div>
      </div>

      <div className='flex items-center justify-between gap-6 p-6'>
        <div className='flex flex-col gap-2'>
          <span className='text-muted-foreground text-sm'>Display Name</span>
          <Skeleton className='h-4 w-56' />
        </div>
        <Skeleton className='h-8 w-12.5 rounded-none' />
      </div>

      <div className='p-6'>
        <div className='flex flex-col gap-2'>
          <span className='text-muted-foreground text-sm'>Email</span>
          <Skeleton className='h-4 w-64' />
        </div>
      </div>

      <div className='p-6'>
        <div className='flex flex-col gap-2'>
          <span className='text-muted-foreground text-sm'>Account Created</span>
          <Skeleton className='h-4 w-44' />
        </div>
      </div>
    </div>
  )
}
