'use client'

import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function ActiveSessionsSkeleton({ count = 3 }: { count?: number }) {
  const items = Array.from({ length: count }, (_, index) => index + 1)

  return (
    <div className='space-y-4'>
      {items.map((item) => (
        <Card className='gap-0 rounded-none border-dashed py-0' key={item}>
          <div className='flex items-start justify-between gap-6 p-4 sm:p-6'>
            <div className='flex gap-4'>
              <Skeleton className='size-10 rounded-md' />
              <div className='space-y-2'>
                <Skeleton className='h-4 w-36' />
                <Skeleton className='h-3 w-44' />
                <Skeleton className='h-3 w-28' />
              </div>
            </div>
            <Skeleton className='h-9 w-20' />
          </div>
        </Card>
      ))}
    </div>
  )
}
