'use client'

import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function ActiveSessionsSkeleton({ count = 3 }: { count?: number }) {
  const items = Array.from({ length: count }, (_, index) => index + 1)

  return (
    <div className='space-y-4'>
      {items.map((item) => (
        <Card className='gap-0 rounded-none border-dashed py-0' key={item}>
          <div className='flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6'>
            <div className='flex gap-4'>
              <Skeleton className='size-10 rounded-md shrink-0' />

              <div className='space-y-1'>
                <div className='flex items-center gap-2'>
                  <Skeleton className='h-4 w-20' />
                </div>
                <div className='space-y-1'>
                  <Skeleton className='h-3 w-44' />
                  <Skeleton className='h-3 w-28' />
                  <Skeleton className='h-3 w-40' />
                </div>
              </div>
            </div>
            <Skeleton className='h-8 w-full sm:w-18 rounded-none' />
          </div>
        </Card>
      ))}
    </div>
  )
}
