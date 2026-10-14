import type { MascotAgent } from './provider'

type Animation = string | readonly string[]

function pickAnimation(animation: Animation): string {
  if (typeof animation === 'string') {
    return animation
  }
  return animation[Math.floor(Math.random() * animation.length)] ?? ''
}

export function playAnimation(
  agent: MascotAgent,
  animation: Animation,
  { interrupt = false }: { interrupt?: boolean } = {}
) {
  const name = pickAnimation(animation)
  // Avatars don't share animation names, so skip ones this avatar lacks
  // rather than stopping it for nothing
  if (!agent.hasAnimation(name)) {
    return
  }
  if (interrupt) {
    agent.stop()
  }
  agent.play(name)
}
