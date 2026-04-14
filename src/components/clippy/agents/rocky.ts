import RockyOriginal from 'clippyjs/agents/rocky'

const BASE = '/assets/clippy/rocky'

export const Rocky = {
  ...RockyOriginal,
  map: () => Promise.resolve({ default: `${BASE}/rocky.png` }),
  sound: () =>
    Promise.resolve({
      default: Object.fromEntries(
        Array.from({ length: 34 }, (_, i) => [
          String(i + 1),
          `${BASE}/sounds/rocky-${i + 1}.mp3`,
        ])
      ),
    }),
}
