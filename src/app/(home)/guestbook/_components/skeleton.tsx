import { Skeleton } from '@/components/ui/skeleton'

const guestbookSkeletonItems = ['first', 'second', 'third', 'fourth']

export function GuestbookEntriesSkeleton() {
  return (
    <div className='dashed-stack min-h-0 w-full flex-1 overflow-hidden'>
      {guestbookSkeletonItems.map((item) => (
        <div className='relative grid gap-4 bg-card/50 p-6' key={item}>
          <div className='flex items-start justify-between gap-3'>
            <div className='space-y-1'>
              <Skeleton className='h-5 w-24' />
              <Skeleton className='h-4 w-32' />
            </div>
            <div className='flex gap-1'>
              <Skeleton className='size-8 rounded-md' />
              <Skeleton className='size-8 rounded-md' />
            </div>
          </div>
          <Skeleton className='h-5 w-4/5' />
          <div className='flex w-full items-end justify-between gap-4'>
            <div className='flex flex-wrap gap-2'>
              <Skeleton className='h-7 w-16 rounded-full' />
              <Skeleton className='h-7 w-14 rounded-full' />
            </div>
            <Skeleton className='h-[63px] w-[140px] rounded border border-border border-dashed' />
          </div>
        </div>
      ))}
    </div>
  )
}
