import { cn } from '@/lib/utils'
import { sprite } from './constants'

// Shows Rover's first sprite frame, scaled to fit a square of `size`
export function AvatarIcon({
  className,
  size = 24,
}: {
  className?: string
  size?: number
}) {
  const { frame, padding, sheet, src } = sprite
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
          backgroundImage: `url(${src})`,
          backgroundPosition: '0 0',
          backgroundRepeat: 'no-repeat',
          backgroundSize: `${sheet[0] * scale}px ${sheet[1] * scale}px`,
          height: frame[1] * scale,
          // The sprite sits unevenly in its frame, so shift the dog to center
          transform: `translateY(${((padding.bottom - padding.top) / 2) * scale}px)`,
          width: frame[0] * scale,
        }}
      />
    </span>
  )
}
