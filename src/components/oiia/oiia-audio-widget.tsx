'use client'

import { MediaPlayer, MediaProvider, useMediaRemote } from '@vidstack/react'
import {
  DefaultVideoLayout,
  defaultLayoutIcons,
} from '@vidstack/react/player/layouts/default'
import { useEffect, useState } from 'react'
import { useOiiaMode } from './oiia-provider'

const AudioSources = [
  'https://www.youtube.com/watch?v=IxX_QHay02M',
  'https://www.youtube.com/watch?v=A2LGuBlDloQ&list=RDA2LGuBlDloQ&start_radio=1',
] as const

const pickRandomSource = () =>
  AudioSources[Math.floor(Math.random() * AudioSources.length)] ??
  AudioSources[0]

export function OiiaAudioWidget() {
  const { mode, playRequest } = useOiiaMode()
  const isOiia = mode === 'oiia'
  const remote = useMediaRemote()
  const [source, setSource] = useState<string | null>(null)

  useEffect(() => {
    if (!isOiia) {
      setSource(null)
      return
    }
    setSource(pickRandomSource())
  }, [isOiia])

  useEffect(() => {
    if (!isOiia || !source) {
      return
    }
    remote.play()
  }, [isOiia, playRequest, remote, source])

  if (!isOiia) {
    return null
  }

  if (!source) {
    return null
  }

  return (
    <div className='fixed left-4 bottom-4 z-50 flex items-center gap-2 oiia-audio-widget'>
      <MediaPlayer
        className='w-[320px] overflow-hidden rounded-lg border border-dashed bg-fd-popover text-fd-popover-foreground shadow-lg'
        src={source ?? undefined}
        autoPlay
        loop
        playsInline
      >
        <MediaProvider />
        <DefaultVideoLayout icons={defaultLayoutIcons} />
      </MediaPlayer>
    </div>
  )
}
