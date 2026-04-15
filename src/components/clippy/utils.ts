import type { ClippyAgent } from './provider'

type Animation = string | readonly string[]

function pickAnimation(animation: Animation): string {
  if (typeof animation === 'string') {
    return animation
  }
  return animation[Math.floor(Math.random() * animation.length)] ?? ''
}

export function playAnimation(
  agent: ClippyAgent,
  animation: Animation,
  { interrupt = false }: { interrupt?: boolean } = {}
) {
  if (interrupt) {
    agent.stop()
  }
  agent.play(pickAnimation(animation))
}
