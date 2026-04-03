'use client'

import { MediaPlayer, MediaProvider, useMediaRemote } from '@vidstack/react'
import { useEffect, useRef, useState } from 'react'
import { useOiiaMode } from './oiia-provider'

const AUDIO_SOURCES = [
  'https://www.youtube.com/watch?v=IxX_QHay02M',
  'https://www.youtube.com/watch?v=A2LGuBlDloQ',
] as const

const MIN_VOLUME = 0.05
const MAX_VOLUME = 0.9
const CATS_FOR_MAX = 20

function volumeForCount(count: number) {
  return (
    MIN_VOLUME +
    ((MAX_VOLUME - MIN_VOLUME) * Math.min(count, CATS_FOR_MAX)) / CATS_FOR_MAX
  )
}

function pickSource() {
  return (
    AUDIO_SOURCES[Math.floor(Math.random() * AUDIO_SOURCES.length)] ??
    AUDIO_SOURCES[0]
  )
}

function VolumeController({ catCount }: { catCount: number }) {
  const remote = useMediaRemote()
  const lastCount = useRef(0)

  useEffect(() => {
    const vol = volumeForCount(catCount)
    remote.changeVolume(vol)

    // Extra kick: replay audio on first cat spawn if it stalled
    if (lastCount.current === 0 && catCount > 0) {
      remote.play()
    }
    lastCount.current = catCount
  }, [catCount, remote])

  return null
}

export function OiiaAudio() {
  const { mode, catCount } = useOiiaMode()
  const isOiia = mode === 'oiia'
  const [source, setSource] = useState<string | null>(null)

  useEffect(() => {
    if (isOiia) {
      setSource(pickSource())
    } else {
      setSource(null)
    }
  }, [isOiia])

  if (!(isOiia && source)) {
    return null
  }

  return (
    <div
      aria-hidden='true'
      className='pointer-events-none fixed top-0 left-0 z-[-1] opacity-0'
    >
      <MediaPlayer
        autoPlay
        loop
        playsInline
        src={source}
        volume={volumeForCount(catCount)}
      >
        <MediaProvider />
        <VolumeController catCount={catCount} />
      </MediaPlayer>
    </div>
  )
}
