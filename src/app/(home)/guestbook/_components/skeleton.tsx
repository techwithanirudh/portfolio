import { Skeleton } from '@/components/ui/skeleton'

export function GuestbookEntriesSkeleton() {
  return (
    <div className='dashed-stack min-h-0 w-full flex-1 animate-delayed-show overflow-hidden'>
      {['first', 'second', 'third', 'fourth'].map((item) => (
        <div className='relative grid gap-4 bg-card/50 p-6' key={item}>
          <div className='space-y-1'>
            <Skeleton className='h-5 w-24' />
            <Skeleton className='h-4 w-32' />
          </div>
          <Skeleton className='h-5 w-4/5' />
          <div className='flex w-full items-end justify-between gap-4'>
            <div className='flex flex-wrap gap-2'>
              <Skeleton className='h-8 w-18 rounded-none' />
              <Skeleton className='h-8 w-23 rounded-none' />
            </div>
            <Skeleton className='h-[63px] w-[140px] rounded border border-border border-dashed' />
          </div>
        </div>
      ))}
    </div>
  )
}
