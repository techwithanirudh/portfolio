import { type RefObject, useEffect } from 'react'
import { between } from './use-sprite-frames'

/** Eyes cast down at the book, a touch lower with every line */
const FIRST_LINE_Y = 1.6
const LINE_STEP_Y = 0.35
const RETURN_MS = 130

/**
 * While he holds the book his pupils sweep along lines, writing useLook's variables
 * (useLook stays off meanwhile) and clearing them when he stops
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
    let gazeTimer: ReturnType<typeof setTimeout> | undefined
    let lidTimer: ReturnType<typeof setTimeout> | undefined
    let cancelled = false

    const blink = () => {
      set('--lid-ease', '70ms ease-in')
      // How far the lid drops to close the eye
      set('--lid', '17px')
      lidTimer = setTimeout(() => {
        set('--lid-ease', '120ms ease-out')
        set('--lid', '0px')
      }, 130)
    }
    const line = (index: number) => {
      if (cancelled) {
        return
      }
      // Four lines a page; the pupils sweep -2.8 to 2.8 in the sheet's units,
      // inside the eye whites' clip
      const y = FIRST_LINE_Y + (index % 4) * LINE_STEP_Y
      gaze(-2.8, y, `${RETURN_MS}ms ease-out`)
      if (Math.random() < 0.18) {
        blink()
      }
      gazeTimer = setTimeout(() => {
        const sweep = between(680, 980)
        gaze(2.8, y, `${sweep}ms cubic-bezier(0.3, 0.1, 0.7, 0.9)`)
        const pause = Math.random() < 0.12 ? between(450, 850) : 0
        gazeTimer = setTimeout(() => line(index + 1), sweep + pause)
      }, RETURN_MS + between(40, 130))
    }

    set('--look-tilt', '0deg')
    if (scan) {
      gaze(0, FIRST_LINE_Y, '250ms ease-out')
      gazeTimer = setTimeout(() => line(0), 260)
    } else {
      gaze(0, FIRST_LINE_Y + LINE_STEP_Y, '0s')
    }

    return () => {
      cancelled = true
      clearTimeout(gazeTimer)
      clearTimeout(lidTimer)
      for (const name of [
        '--look-x',
        '--look-y',
        '--look-tilt',
        '--look-ease',
        '--lid',
        '--lid-ease',
      ]) {
        svg.style.removeProperty(name)
      }
    }
  }, [reading, ref, scan])
}
