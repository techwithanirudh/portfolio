import { DitherField } from '@/components/shader/dither-field'
import { GrainField } from '@/components/shader/grain-field'

// Which shader fills the cover. 'dither' is the interactive dot field,
// 'grain' is Paper's grain gradient.
const COVER: 'dither' | 'grain' = 'dither'

export function ProfileCover() {
  return (
    <div className='screen-line-bottom relative h-36 overflow-hidden border-line border-x sm:h-48'>
      {COVER === 'grain' ? (
        <GrainField className='absolute inset-0' />
      ) : (
        <DitherField className='absolute inset-0' />
      )}
    </div>
  )
}
