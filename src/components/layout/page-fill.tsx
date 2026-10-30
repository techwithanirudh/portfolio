import { CrossPair } from '@/components/layout/sections'

export const PageFill = () => (
  <div
    aria-hidden
    className='relative flex in-[#main-content:has([data-slot=section][data-fill])]:hidden grow basis-0 flex-col overflow-hidden'
    data-slot='page-fill'
  >
    {/* mb-2 leaves room for the crosses to overhang the bottom edge */}
    <div className='container relative mx-auto mb-2 flex-1 border-border border-dashed sm:border-x'>
      <CrossPair />
    </div>
    {/* bottom-[7px] runs the line through the crosses' centers */}
    <span className='absolute inset-x-0 bottom-[7px] border-border border-b border-dashed' />
  </div>
)
