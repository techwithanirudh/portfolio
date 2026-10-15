import { DitherField } from '@/components/shader/dither-field'

export function ProfileCover() {
  return (
    <div className='screen-line-bottom relative h-36 overflow-hidden border-line border-x sm:h-48'>
      <DitherField className='absolute inset-0' />
    </div>
  )
}
