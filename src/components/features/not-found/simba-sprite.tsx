import { sprite } from '@/components/features/assistant/mascot/constants'

const [FRAME] = sprite.frame
const [SHEET_WIDTH] = sprite.sheet
const SCALE = 2

export const SimbaSprite = () => (
  <div
    aria-hidden
    className='shrink-0 bg-no-repeat [image-rendering:pixelated]'
    style={{
      backgroundImage: `url(${sprite.src})`,
      backgroundPosition: '0 0',
      backgroundSize: `${SHEET_WIDTH * SCALE}px auto`,
      height: FRAME * SCALE,
      width: FRAME * SCALE,
    }}
  />
)
