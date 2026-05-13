'use client'

import '@vidstack/react/player/styles/default/theme.css'
import '@vidstack/react/player/styles/default/layouts/video.css'

import { MediaPlayer, MediaProvider } from '@vidstack/react'
import {
  DefaultVideoLayout,
  defaultLayoutIcons,
} from '@vidstack/react/player/layouts/default'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'
import './video-player.css';

export interface VideoPlayerProps extends ComponentProps<typeof MediaPlayer> {
  poster?: string
  thumbnails?: string
}

export const VideoPlayer = ({
  className,
  poster,
  thumbnails,
  ...props
}: VideoPlayerProps) => (
  <MediaPlayer
    className={cn(
      'w-full overflow-hidden !rounded-xl relative !border-none',
      className
    )}
    poster={poster}
    {...props}
  >
    <MediaProvider />
    <DefaultVideoLayout
      colorScheme='default'
      icons={defaultLayoutIcons}
      thumbnails={thumbnails}
    />
    <div className='pointer-events-none absolute inset-0 rounded-xl ring-1 ring-black/10 ring-inset dark:ring-white/10' />
  </MediaPlayer>
)
