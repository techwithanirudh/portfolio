import { cn } from '@/lib/utils'
import { SIMBA } from './constants'

// Offsets the frame's transparent padding so the dog sits centered
export function AvatarIcon({
  className,
  size = 24,
}: {
  className?: string
  size?: number
}) {
  const { frame, padding, sheet, sprite } = SIMBA
  const scale = size / Math.max(...frame)

  return (
    <span
      aria-label='Simba'
      className={cn(
        'inline-flex shrink-0 items-center justify-center',
        className
      )}
      role='img'
      style={{ height: size, width: size }}
    >
      <span
        style={{
          backgroundImage: `url(${sprite})`,
          backgroundPosition: '0 0',
          backgroundRepeat: 'no-repeat',
          backgroundSize: `${sheet[0] * scale}px ${sheet[1] * scale}px`,
          height: frame[1] * scale,
          translate: `${(padding.right * scale) / 2}px ${(padding.bottom * scale) / 2}px`,
          width: frame[0] * scale,
        }}
      />
    </span>
  )
}
