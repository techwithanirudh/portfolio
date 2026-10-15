import { currentRevision, getSheet, type SheetCode, sheets } from './data'
import { PointerCoordinates } from './pointer-coordinates'

const zones = [1, 2, 3, 4, 5, 6, 7, 8]

/**
 * The strip every sheet starts with: sheet number and name on the left, a live
 * pointer readout on the right, and the drawing frame's zone numbers below.
 */
export function SheetHeader({ code }: { code: SheetCode }) {
  const sheet = getSheet(code)
  const index = sheets.indexOf(sheet) + 1

  return (
    <div className='screen-line-bottom'>
      <div className='screen-line-bottom flex h-10 items-center justify-between gap-4 px-4 md:px-6'>
        <p className='ds-label whitespace-nowrap'>
          <span className='text-(--ink)'>Sheet {sheet.code}</span>
          <span className='px-1.5 text-(--ink-faint)'>·</span>
          {sheet.name}
        </p>
        <p className='ds-label hidden whitespace-nowrap md:block'>
          {String(index).padStart(2, '0')} of{' '}
          {String(sheets.length).padStart(2, '0')}
          <span className='px-1.5 text-(--ink-faint)'>·</span>
          Rev {currentRevision.letter}
          <span className='px-1.5 text-(--ink-faint)'>·</span>
          Scale 1:1
        </p>
        <PointerCoordinates />
      </div>
      <ol
        aria-hidden
        className='grid h-5 grid-cols-4 font-mono text-(--ink-faint) text-[10px] md:grid-cols-8'
      >
        {zones.map((zone) => (
          <li
            className='relative flex items-center justify-center border-(--line) border-l first:border-l-0 max-md:nth-[n+5]:hidden'
            key={zone}
          >
            <span
              aria-hidden
              className='absolute bottom-0 left-1/2 h-1 w-px bg-(--line)'
            />
            {zone}
          </li>
        ))}
      </ol>
    </div>
  )
}
