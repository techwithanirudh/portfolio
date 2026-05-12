import { Skeleton } from '@/components/ui/skeleton'
import { ViewAnimation } from '@/components/view-animation'

const guestbookSkeletonItems = ['first', 'second', 'third', 'fourth']

export function GuestbookEntriesSkeleton() {
  return (
    <ViewAnimation
      delay={0.15}
      initial={{ opacity: 0, translateY: 6 }}
      whileInView={{ opacity: 1, translateY: 0 }}
    >
      <div className='h-[32rem] w-full divide-y divide-dashed divide-border overflow-hidden'>
        {guestbookSkeletonItems.map((item) => (
          <div className='relative grid gap-4 bg-card/50 px-6 py-6' key={item}>
            <div className='flex items-start justify-between gap-3'>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-3 w-32' />
              </div>
              <div className='flex gap-1'>
                <Skeleton className='size-8 rounded-md' />
                <Skeleton className='size-8 rounded-md' />
              </div>
            </div>
            <Skeleton className='h-4 w-4/5' />
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
    </ViewAnimation>
  )
}
