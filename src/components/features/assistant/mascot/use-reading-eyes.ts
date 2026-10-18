import { type RefObject, useEffect } from 'react'
import { between } from './use-sprite-frames'

/** Pupil offsets in the sheet's units, inside the eye whites' clip */
const LINE_LEFT = -2.8
const LINE_RIGHT = 2.8
/** Eyes cast down at the book, a touch lower with every line */
const FIRST_LINE_Y = 1.6
const LINE_STEP_Y = 0.35
const LINES = 4
/** How far the lid drops to close the eye */
const LID_SHUT = 17

const SWEEP_MIN_MS = 680
const SWEEP_MAX_MS = 980
const RETURN_MS = 130
const DWELL_MIN_MS = 40
const DWELL_MAX_MS = 130
const PAUSE_CHANCE = 0.12
const PAUSE_MIN_MS = 450
const PAUSE_MAX_MS = 850
const BLINK_CHANCE = 0.18

const VARS = [
  '--look-x',
  '--look-y',
  '--look-tilt',
  '--look-ease',
  '--lid',
  '--lid-ease',
]

/**
 * While he holds the book his pupils read it: a slow sweep left to right along
 * a line, a quick return to the start of the next one, now and then a pause at
 * the end of a line or a blink on the return. It writes the same variables as
 * useLook, which stays off meanwhile, and clears them when he stops so the
 * eyes go back to rest. Without scan the eyes just rest on the book
 */
export function useReadingEyes(
  ref: RefObject<SVGSVGElement | null>,
  { reading, scan }: { reading: boolean; scan: boolean }
) {
  useEffect(() => {
    const svg = ref.current
    if (!(svg && reading)) {
      return
    }
    const set = (name: string, value: string) =>
      svg.style.setProperty(name, value)
    const gaze = (x: number, y: number, ease: string) => {
      set('--look-ease', ease)
      set('--look-x', `${x}px`)
      set('--look-y', `${y}px`)
    }
    // One chain of timers for the gaze and one for the lids, each holding at
    // most one timer at a time
    let gazeTimer: ReturnType<typeof setTimeout> | undefined
    let lidTimer: ReturnType<typeof setTimeout> | undefined
    let cancelled = false

    const blink = () => {
      set('--lid-ease', '70ms ease-in')
      set('--lid', `${LID_SHUT}px`)
      lidTimer = setTimeout(() => {
        set('--lid-ease', '120ms ease-out')
        set('--lid', '0px')
      }, 130)
    }
    const line = (index: number) => {
      if (cancelled) {
        return
      }
      const y = FIRST_LINE_Y + (index % LINES) * LINE_STEP_Y
      gaze(LINE_LEFT, y, `${RETURN_MS}ms ease-out`)
      if (Math.random() < BLINK_CHANCE) {
        blink()
      }
      gazeTimer = setTimeout(() => {
        const sweep = between(SWEEP_MIN_MS, SWEEP_MAX_MS)
        gaze(LINE_RIGHT, y, `${sweep}ms cubic-bezier(0.3, 0.1, 0.7, 0.9)`)
        const pause =
          Math.random() < PAUSE_CHANCE ? between(PAUSE_MIN_MS, PAUSE_MAX_MS) : 0
        gazeTimer = setTimeout(() => line(index + 1), sweep + pause)
      }, RETURN_MS + between(DWELL_MIN_MS, DWELL_MAX_MS))
    }

    set('--look-tilt', '0deg')
    if (scan) {
      // Eyes drop to the book first, then he starts on the first line
      gaze(0, FIRST_LINE_Y, '250ms ease-out')
      gazeTimer = setTimeout(() => line(0), 260)
    } else {
      gaze(0, FIRST_LINE_Y + LINE_STEP_Y, '0s')
    }

    return () => {
      cancelled = true
      clearTimeout(gazeTimer)
      clearTimeout(lidTimer)
      for (const name of VARS) {
        svg.style.removeProperty(name)
      }
    }
  }, [reading, ref, scan])
}
