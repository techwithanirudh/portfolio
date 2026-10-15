import { prefersReducedMotion } from '@/lib/reduced-motion'
import type { TrickName } from './constants'
import type { MascotAgent } from './provider'

interface Trick {
  keyframes: Keyframe[]
  options: KeyframeAnimationOptions
  origin?: string
  // Sprite animation to play alongside, by what each avatar has
  sprite: readonly string[]
}

const tricks: Record<TrickName, Trick> = {
  backflip: {
    keyframes: [
      { offset: 0, transform: 'translateY(0) rotate(0deg)' },
      { offset: 0.5, transform: 'translateY(-90px) rotate(-180deg)' },
      { offset: 1, transform: 'translateY(0) rotate(-360deg)' },
    ],
    options: { duration: 900, easing: 'ease-in-out' },
    sprite: ['Surprised', 'Alert'],
  },
  jump: {
    keyframes: [
      { offset: 0, transform: 'translateY(0)' },
      { offset: 0.25, transform: 'translateY(-70px)' },
      { offset: 0.5, transform: 'translateY(0)' },
      { offset: 0.75, transform: 'translateY(-45px)' },
      { offset: 1, transform: 'translateY(0)' },
    ],
    options: { duration: 1000, easing: 'ease-out' },
    sprite: ['Congratulate', 'GetAttention'],
  },
  play_dead: {
    keyframes: [
      { offset: 0, transform: 'rotate(0deg) translateY(0)' },
      { offset: 0.2, transform: 'rotate(95deg) translateY(10px)' },
      { offset: 0.8, transform: 'rotate(95deg) translateY(10px)' },
      { offset: 0.9, transform: 'rotate(0deg) translateY(-40px)' },
      { offset: 1, transform: 'rotate(0deg) translateY(0)' },
    ],
    options: { duration: 2600, easing: 'ease-in-out' },
    origin: '50% 100%',
    sprite: ['RestPose'],
  },
  roll_over: {
    keyframes: [
      { offset: 0, transform: 'translateX(0) rotate(0deg)' },
      { offset: 0.5, transform: 'translateX(-120px) rotate(-360deg)' },
      { offset: 1, transform: 'translateX(0) rotate(-720deg)' },
    ],
    options: { duration: 1600, easing: 'ease-in-out' },
    sprite: ['Pleased', 'Acknowledge', 'GetAttentionMinor'],
  },
  spin: {
    keyframes: [
      { offset: 0, transform: 'rotate(0deg)' },
      { offset: 1, transform: 'rotate(720deg)' },
    ],
    options: { duration: 1100, easing: 'ease-in-out' },
    sprite: ['Congratulate', 'Pleased'],
  },
}

export function playTrick(agent: MascotAgent, name: TrickName) {
  const trick = tricks[name]
  const sprite = trick.sprite.find((anim) => agent.hasAnimation(anim))

  agent.stop()
  if (sprite) {
    agent.play(sprite)
  }

  if (prefersReducedMotion()) {
    return
  }

  const el = agent._el
  const previousOrigin = el.style.transformOrigin
  el.style.transformOrigin = trick.origin ?? '50% 50%'
  el.animate(trick.keyframes, trick.options)
    .finished.catch(() => undefined)
    .finally(() => {
      el.style.transformOrigin = previousOrigin
    })
}
