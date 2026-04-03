'use client'

import { useEffect, useRef, useState } from 'react'
import { useOiiaMode } from './oiia-provider'

const YOUTUBE_IDS = ['IxX_QHay02M', 'A2LGuBlDloQ'] as const

const MIN_VOL = 5 // 0-100 scale
const MAX_VOL = 85
const CATS_AT_MAX = 20

const volumeFor = (count: number) =>
  Math.round(
    MIN_VOL + ((MAX_VOL - MIN_VOL) * Math.min(count, CATS_AT_MAX)) / CATS_AT_MAX
  )

function postVolume(iframe: HTMLIFrameElement | null, vol: number) {
  iframe?.contentWindow?.postMessage(
    JSON.stringify({ event: 'command', func: 'setVolume', args: [vol] }),
    '*'
  )
}

export function OiiaAudio() {
  const { mode, catCount } = useOiiaMode()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [videoId, setVideoId] = useState<string | null>(null)

  useEffect(() => {
    if (mode === 'oiia') {
      setVideoId(
        YOUTUBE_IDS[Math.floor(Math.random() * YOUTUBE_IDS.length)] ??
          YOUTUBE_IDS[0]
      )
    } else {
      setVideoId(null)
    }
  }, [mode])

  // Sync volume as cat count changes
  useEffect(() => {
    postVolume(iframeRef.current, volumeFor(catCount))
  }, [catCount])

  if (mode !== 'oiia' || !videoId) {
    return null
  }

  return (
    <iframe
      allow='autoplay'
      aria-hidden='true'
      // Off-screen but not display:none — display:none prevents autoplay
      className='pointer-events-none fixed'
      ref={iframeRef}
      src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0&enablejsapi=1`}
      style={{ left: '-9999px', top: '-9999px', width: '1px', height: '1px' }}
      title='oiia music'
    />
  )
}
