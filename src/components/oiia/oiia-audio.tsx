'use client'

import { useEffect, useRef } from 'react'
import { useOiiaMode } from './oiia-provider'

// playlist= plays them in order, loop=1 cycles back after the last one
const PLAYLIST = 'IxX_QHay02M,A2LGuBlDloQ'
const FIRST_ID = 'IxX_QHay02M'

const MIN_VOL = 5
const MAX_VOL = 85
const CATS_AT_MAX = 20
const vol = (n: number) =>
  Math.round(
    MIN_VOL + ((MAX_VOL - MIN_VOL) * Math.min(n, CATS_AT_MAX)) / CATS_AT_MAX
  )

export function OiiaAudio() {
  const { mode, catCount } = useOiiaMode()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const catCountRef = useRef(catCount)

  useEffect(() => {
    catCountRef.current = catCount
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({
        event: 'command',
        func: 'setVolume',
        args: [vol(catCount)],
      }),
      '*'
    )
  }, [catCount])

  if (mode !== 'oiia') {
    return null
  }

  return (
    <iframe
      allow='autoplay; picture-in-picture 0'
      aria-hidden='true'
      className='pointer-events-none fixed'
      onLoad={() => {
        iframeRef.current?.contentWindow?.postMessage(
          JSON.stringify({
            event: 'command',
            func: 'setVolume',
            args: [vol(catCountRef.current)],
          }),
          '*'
        )
      }}
      ref={iframeRef}
      src={`https://www.youtube-nocookie.com/embed/${FIRST_ID}?autoplay=1&loop=1&playlist=${PLAYLIST}&controls=0&enablejsapi=1`}
      style={{ left: '-9999px', top: '-9999px', width: '1px', height: '1px' }}
      title='oiia music'
    />
  )
}
