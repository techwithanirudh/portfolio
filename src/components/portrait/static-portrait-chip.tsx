import {
  PORTRAIT_CHIP_VIEW_BOX,
  PORTRAIT_EYE_FILL,
  PORTRAIT_HEIGHT,
  PORTRAIT_WIDTH,
} from '@/lib/portrait-eyes'
import { cn } from '@/lib/utils'
import { BlinkingEyes } from './blinking-eyes'
import { portraitChipClassName } from './chip-class-names'

export const StaticPortraitChip = ({ className }: { className?: string }) => (
  <span aria-hidden className={cn(portraitChipClassName, className)}>
    <svg className='block size-full' viewBox={PORTRAIT_CHIP_VIEW_BOX}>
      <image
        height={PORTRAIT_HEIGHT}
        href='/images/portrait.svg'
        width={PORTRAIT_WIDTH}
      />
      <BlinkingEyes fill={PORTRAIT_EYE_FILL} />
    </svg>
  </span>
)
