import { cn } from '@/lib/utils'
import { SimbaRig } from './rig'

export function AvatarIcon({
  className,
  size = 24,
}: {
  className?: string
  size?: number
}) {
  return (
    <span
      aria-label='Simba'
      className={cn(
        'inline-flex shrink-0 items-end justify-center overflow-hidden',
        className
      )}
      role='img'
      style={{ height: size, width: size }}
    >
      <SimbaRig pose='rest' size={size * 1.08} />
    </span>
  )
}
