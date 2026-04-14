import RoverOriginal from 'clippyjs/agents/rover'

const STATIC_ROVER_MAP_URL = '/assets/clippy/rover.png' as const

export const Rover = {
  ...RoverOriginal,
  // Keep the upstream animation and sound modules, but load the sprite sheet
  // from a stable static asset instead of the package's inlined data URL.
  map: () => Promise.resolve({ default: STATIC_ROVER_MAP_URL }),
}
