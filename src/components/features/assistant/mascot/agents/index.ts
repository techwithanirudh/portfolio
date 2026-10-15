import type { AvatarName } from '../constants'
import { Rocky } from './rocky'
import { Rover } from './rover'

export const avatars = {
  rocky: Rocky,
  rover: Rover,
} satisfies Record<AvatarName, unknown>
