import { DitherField } from '@/components/shader/dither-field'

export function ProfileCover() {
  return (
    <div className='screen-line-bottom relative h-36 overflow-hidden border-line border-x sm:h-48'>
      <DitherField className='absolute inset-0' />
      <p className='pointer-events-none absolute bottom-2 left-3 pointer-fine:block hidden select-none font-mono text-[11px] text-muted-foreground/70'>
        {'// move your cursor over the dots'}
      </p>
    </div>
  )
}
