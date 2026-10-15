// Simba, a Shih Tzu. Frames are cut from an illustrated sheet into 104x100
// cells, feet on the cell floor, by a one-off script; this is its output.
const BASE = '/assets/clippy/simba'

const agent = {
  animations: {
    Alert: {
      frames: [
        { duration: 300, images: [[832, 200]] },
        { duration: 300, images: [[936, 200]] },
        { duration: 120, images: [[0, 0]] },
      ],
    },
    Books: {
      frames: [
        { duration: 400, images: [[936, 100]] },
        { duration: 400, images: [[0, 200]] },
        { duration: 400, images: [[104, 200]] },
        { duration: 500, images: [[208, 200]] },
        { duration: 120, images: [[0, 0]] },
      ],
    },
    Butterfly: {
      frames: [
        { duration: 200, images: [[208, 300]] },
        { duration: 200, images: [[312, 300]] },
        { duration: 220, images: [[416, 300]] },
        { duration: 220, images: [[520, 300]] },
        { duration: 300, images: [[624, 300]] },
        { duration: 120, images: [[0, 0]] },
      ],
    },
    ClickedOn: {
      frames: [
        { duration: 150, images: [[104, 100]] },
        { duration: 250, images: [[312, 100]] },
        { duration: 120, images: [[0, 0]] },
      ],
    },
    Congratulate: {
      frames: [
        { duration: 150, images: [[312, 200]] },
        { duration: 150, images: [[416, 200]] },
        { duration: 150, images: [[520, 200]] },
        { duration: 200, images: [[624, 200]] },
        { duration: 120, images: [[0, 0]] },
      ],
    },
    Embarrassed: {
      frames: [
        { duration: 300, images: [[0, 300]] },
        { duration: 500, images: [[104, 300]] },
        { duration: 120, images: [[0, 0]] },
      ],
    },
    Flower: {
      frames: [
        { duration: 250, images: [[0, 400]] },
        { duration: 250, images: [[104, 400]] },
        { duration: 400, images: [[208, 400]] },
        { duration: 120, images: [[0, 0]] },
      ],
    },
    GetAttention: {
      frames: [
        { duration: 150, images: [[832, 0]] },
        { duration: 150, images: [[936, 0]] },
        { duration: 150, images: [[832, 0]] },
        { duration: 150, images: [[936, 0]] },
        { duration: 120, images: [[0, 0]] },
      ],
    },
    Greet: {
      frames: [
        { duration: 120, images: [[624, 0]] },
        { duration: 120, images: [[728, 0]] },
        { duration: 150, images: [[832, 0]] },
        { duration: 150, images: [[936, 0]] },
        { duration: 150, images: [[832, 0]] },
        { duration: 150, images: [[936, 0]] },
        { duration: 120, images: [[0, 100]] },
        { duration: 120, images: [[0, 0]] },
      ],
    },
    Hide: {
      frames: [
        { duration: 130, images: [[624, 400]] },
        { duration: 130, images: [[728, 400]] },
        { duration: 200, images: [[832, 400]] },
      ],
    },
    Idle: {
      frames: [
        { duration: 1400, images: [[0, 0]] },
        { duration: 70, images: [[104, 0]] },
        { duration: 110, images: [[208, 0]] },
        { duration: 70, images: [[104, 0]] },
        { duration: 1800, images: [[0, 0]] },
        { duration: 900, images: [[312, 0]] },
        { duration: 300, images: [[416, 0]] },
        { duration: 1200, images: [[0, 0]] },
        { duration: 700, images: [[520, 0]] },
        { duration: 900, images: [[0, 0]] },
      ],
    },
    LookUp: {
      frames: [
        { duration: 300, images: [[416, 100]] },
        { duration: 900, images: [[520, 0]] },
        { duration: 120, images: [[0, 0]] },
      ],
    },
    Play: {
      frames: [
        { duration: 180, images: [[728, 300]] },
        { duration: 180, images: [[832, 300]] },
        { duration: 220, images: [[936, 300]] },
        { duration: 180, images: [[832, 300]] },
        { duration: 120, images: [[0, 0]] },
      ],
    },
    Pleased: {
      frames: [
        { duration: 200, images: [[104, 100]] },
        { duration: 160, images: [[208, 100]] },
        { duration: 300, images: [[312, 100]] },
        { duration: 200, images: [[104, 100]] },
        { duration: 120, images: [[0, 0]] },
      ],
    },
    RestPose: { frames: [{ duration: 120, images: [[0, 0]] }] },
    Searching: {
      frames: [
        { duration: 160, images: [[520, 100]] },
        { duration: 160, images: [[624, 100]] },
        { duration: 160, images: [[728, 100]] },
        { duration: 160, images: [[832, 100]] },
        { duration: 160, images: [[728, 100]] },
        { duration: 160, images: [[624, 100]] },
        { duration: 160, images: [[520, 100]] },
        { duration: 120, images: [[0, 0]] },
      ],
    },
    Show: {
      frames: [
        { duration: 130, images: [[312, 400]] },
        { duration: 130, images: [[416, 400]] },
        { duration: 150, images: [[520, 400]] },
        { duration: 120, images: [[0, 0]] },
      ],
    },
    Surprised: {
      frames: [
        { duration: 150, images: [[728, 200]] },
        { duration: 300, images: [[832, 200]] },
        { duration: 300, images: [[936, 200]] },
        { duration: 120, images: [[0, 0]] },
      ],
    },
    Thinking: {
      frames: [
        { duration: 300, images: [[416, 100]] },
        { duration: 900, images: [[520, 0]] },
        { duration: 700, images: [[312, 0]] },
        { duration: 700, images: [[520, 0]] },
        { duration: 120, images: [[0, 0]] },
      ],
    },
    Writing: {
      frames: [
        { duration: 400, images: [[936, 100]] },
        { duration: 400, images: [[0, 200]] },
        { duration: 400, images: [[104, 200]] },
        { duration: 120, images: [[0, 0]] },
      ],
    },
  },
  framesize: [104, 100],
  overlayCount: 1,
  sounds: [],
}

export const Simba = {
  agent: () => Promise.resolve({ default: agent }),
  map: () => Promise.resolve({ default: `${BASE}/simba.webp` }),
  sound: () => Promise.resolve({ default: {} }),
}
