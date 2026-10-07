// Rover's idle pose: frame [0, 0] of the 80x80 clippy sprite sheet.
const FRAME = 80
const SCALE = 2

export const SimbaSprite = () => (
  <div
    aria-hidden
    className='shrink-0 bg-no-repeat [image-rendering:pixelated]'
    style={{
      backgroundImage: 'url(/assets/clippy/rover.png)',
      backgroundPosition: '0 0',
      // sheet is 2160px wide, scale it with the frame
      backgroundSize: `${2160 * SCALE}px auto`,
      height: FRAME * SCALE,
      width: FRAME * SCALE,
    }}
  />
)
