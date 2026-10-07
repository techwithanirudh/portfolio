'use client'

import { useEffect, useRef } from 'react'
import { useOiiaMode } from './provider'

// playlist= plays them in order, loop=1 cycles back after the last one
const PLAYLIST = 'IxX_QHay02M,A2LGuBlDloQ'
const FIRST_ID = 'IxX_QHay02M'
const YOUTUBE_ORIGIN = 'https://www.youtube-nocookie.com'
const PLAYER_ID = 'oiia'

const MIN_VOL = 5
const MAX_VOL = 85
const CATS_AT_MAX = 20
const vol = (n: number) =>
  Math.round(
    MIN_VOL + ((MAX_VOL - MIN_VOL) * Math.min(n, CATS_AT_MAX)) / CATS_AT_MAX
  )

function postToPlayer(iframe: HTMLIFrameElement | null, message: unknown) {
  iframe?.contentWindow?.postMessage(JSON.stringify(message), YOUTUBE_ORIGIN)
}

export function OiiaAudio() {
  const { mode, catCount } = useOiiaMode()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const catCountRef = useRef(catCount)
  const readyRef = useRef(false)

  useEffect(() => {
    catCountRef.current = catCount
    if (readyRef.current) {
      postToPlayer(iframeRef.current, {
        args: [vol(catCount)],
        event: 'command',
        func: 'setVolume',
      })
    }
  }, [catCount])

  useEffect(() => {
    if (mode !== 'oiia') {
      readyRef.current = false
      return
    }

    const onMessage = (event: MessageEvent) => {
      if (
        event.origin !== YOUTUBE_ORIGIN ||
        event.source !== iframeRef.current?.contentWindow
      ) {
        return
      }

      let data: unknown
      try {
        data = JSON.parse(event.data)
      } catch {
        return
      }

      const eventName = (data as { event?: string } | null)?.event
      if (eventName !== 'onReady' && eventName !== 'infoDelivery') {
        return
      }
      if (readyRef.current) {
        return
      }
      readyRef.current = true
      postToPlayer(iframeRef.current, {
        args: [vol(catCountRef.current)],
        event: 'command',
        func: 'setVolume',
      })
    }

    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [mode])

  if (mode !== 'oiia') {
    return null
  }

  return (
    <iframe
      allow="autoplay; picture-in-picture 'none'"
      aria-hidden='true'
      className='pointer-events-none fixed'
      onLoad={() => {
        postToPlayer(iframeRef.current, { event: 'listening', id: PLAYER_ID })
      }}
      ref={iframeRef}
      src={`https://www.youtube-nocookie.com/embed/${FIRST_ID}?autoplay=1&loop=1&playlist=${PLAYLIST}&controls=0&enablejsapi=1`}
      style={{ height: '1px', left: '-9999px', top: '-9999px', width: '1px' }}
      title='oiia music'
    />
  )
}
