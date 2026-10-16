import { Cross } from '@/components/layout/sections'

// Carries the container rails from the last section down to the footer, so
// a page shorter than the screen still reads as part of the grid. The rule
// and crosses that close it sit inside the fill, 8px above its bottom so the
// crosses' lower arms fit, and get clipped away when the fill has no height:
// a page that already reaches the footer is closed by its last section's rule.
// A page that hands the leftover height to its own `<Section fill>` needs none
export const PageFill = () => (
  <div
    aria-hidden
    className='relative flex in-[#main-content:has([data-slot=section][data-fill])]:hidden grow basis-0 flex-col overflow-hidden'
    data-slot='page-fill'
  >
    <div className='container relative mx-auto mb-2 flex-1 border-border border-dashed sm:border-x'>
      <Cross className='-left-[7px]' />
      <Cross className='-right-[7px]' />
    </div>
    <span className='absolute inset-x-0 bottom-[7px] border-border border-b border-dashed' />
  </div>
)
