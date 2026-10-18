import { cn } from '@/lib/utils'
import { type RigView, SimbaRig } from './rig'

const HEAD: RigView = { height: 88, width: 88, x: 25, y: 60 }

export function SimbaChip({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'mx-[0.04em] inline-block size-[1.1em] shrink-0 translate-y-[0.2em] overflow-hidden rounded-full bg-muted ring-1 ring-border',
        className
      )}
    >
      <SimbaRig
        className='size-full'
        pose='rest'
        size='100%'
        still
        view={HEAD}
      />
    </span>
  )
}
