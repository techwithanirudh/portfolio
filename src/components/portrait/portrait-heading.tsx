import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { BonkChip } from './bonk-chip'
import { inlineChipClassName } from './chip-class-names'

/**
 * The chip stays out of the heading so its name doesn't join it: the heading keeps a gap,
 * and a hidden copy of the line showing only the chip is stacked over it in the same cell
 */
export function PortraitHeading({
  after,
  before,
  className,
}: {
  after: ReactNode
  before: ReactNode
  className?: string
}) {
  return (
    <div className='grid *:col-start-1 *:row-start-1'>
      <h1 className={className}>
        {before}{' '}
        <span className='relative inline-block'>
          <span className={cn(inlineChipClassName, 'invisible')} />
        </span>{' '}
        {after}
      </h1>
      <div className={cn(className, 'pointer-events-none invisible')}>
        {before}{' '}
        <span className='pointer-events-auto visible'>
          <BonkChip />
        </span>{' '}
        {after}
      </div>
    </div>
  )
}
