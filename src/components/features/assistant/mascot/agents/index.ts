import type { AvatarName } from '../constants'
import { Rocky } from './rocky'
import { Rover } from './rover'
import { Simba } from './simba'

export const avatars = {
  rocky: Rocky,
  rover: Rover,
  simba: Simba,
} satisfies Record<AvatarName, unknown>
