import { Cross } from '@/components/layout/sections'
import { cn } from '@/lib/utils'

const CROSS_OVERHANG_MARGIN = 'mb-2'
const CROSS_CENTER_BOTTOM_INSET = 'bottom-[7px]'

export const PageFill = () => (
  <div
    aria-hidden
    className='relative flex in-[#main-content:has([data-slot=section][data-fill])]:hidden grow basis-0 flex-col overflow-hidden'
    data-slot='page-fill'
  >
    <div
      className={cn(
        'container relative mx-auto flex-1 border-border border-dashed sm:border-x',
        CROSS_OVERHANG_MARGIN
      )}
    >
      <Cross className='-left-[7px]' />
      <Cross className='-right-[7px]' />
    </div>
    <span
      className={cn(
        'absolute inset-x-0 border-border border-b border-dashed',
        CROSS_CENTER_BOTTOM_INSET
      )}
    />
  </div>
)
