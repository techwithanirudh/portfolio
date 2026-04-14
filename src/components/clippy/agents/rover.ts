import RoverOriginal from 'clippyjs/agents/rover'

const BASE = '/assets/clippy'

export const Rover = {
  ...RoverOriginal,
  map: () => Promise.resolve({ default: `${BASE}/rover.png` }),
  sound: () =>
    Promise.resolve({
      default: Object.fromEntries(
        Array.from({ length: 10 }, (_, i) => [
          String(i + 1),
          `${BASE}/sounds/rover-${i + 1}.mp3`,
        ])
      ),
    }),
}
