import { Skeleton } from '@/components/ui/skeleton'

const guestbookSkeletonItems = ['first', 'second', 'third', 'fourth']

export function GuestbookEntriesSkeleton() {
  return (
    <div className='h-[32rem] w-full divide-y divide-line overflow-hidden'>
      {guestbookSkeletonItems.map((item) => (
        <div className='relative grid gap-4 bg-card/50 px-6 py-6' key={item}>
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
              <Skeleton className='h-7 w-16' />
              <Skeleton className='h-7 w-14' />
            </div>
            <Skeleton className='h-[63px] w-[140px] border border-line' />
          </div>
        </div>
      ))}
    </div>
  )
}
