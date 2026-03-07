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

export interface VideoPlayerProps extends ComponentProps<typeof MediaPlayer> {
  poster?: string
  thumbnails?: string
}

export const VideoPlayer = ({
  className,
  poster,
  thumbnails,
  ...props
}: VideoPlayerProps) => {
  return (
    <MediaPlayer
      className={cn(
        'w-full overflow-hidden rounded-lg border border-border bg-background',
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
    </MediaPlayer>
  )
}
