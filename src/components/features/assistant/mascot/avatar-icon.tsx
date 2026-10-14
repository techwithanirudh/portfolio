import { cn } from '@/lib/utils'
import { type AvatarName, avatarMeta } from './constants'

// Shows the avatar's first sprite frame, scaled to fit a square of `size`
export function AvatarIcon({
  avatar,
  className,
  size = 24,
}: {
  avatar: AvatarName
  className?: string
  size?: number
}) {
  const { frame, label, sheet, sprite } = avatarMeta[avatar]
  const scale = size / Math.max(...frame)

  return (
    <span
      aria-label={label}
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
          width: frame[0] * scale,
        }}
      />
    </span>
  )
}
