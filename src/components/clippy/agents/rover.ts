import RoverOriginal from 'clippyjs/agents/rover'

const STATIC_ROVER_MAP_URL = '/assets/clippy/rover.png' as const

export const Rover = {
  ...RoverOriginal,
  map: () => Promise.resolve({ default: STATIC_ROVER_MAP_URL }),
}
