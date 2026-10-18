import { toast as sonnerToast } from 'sonner'
import { error, success, tap, warning } from '@/lib/audio/minimal'
import { playSound } from '@/lib/audio/preferences'

type SonnerToast = typeof sonnerToast

const variantSounds = { error, success, warning }

type Variant = keyof typeof variantSounds

const isVariant = (prop: PropertyKey): prop is Variant =>
  Object.hasOwn(variantSounds, prop)

export const toast: SonnerToast = new Proxy(sonnerToast, {
  apply(target, thisArg, args) {
    playSound(tap)
    return Reflect.apply(target, thisArg, args)
  },
  get(target, prop, receiver) {
    if (isVariant(prop)) {
      const show: SonnerToast['success'] = sonnerToast[prop]
      return (...args: Parameters<typeof show>) => {
        playSound(variantSounds[prop])
        return show(...args)
      }
    }
    const value = Reflect.get(target, prop, receiver)
    return typeof value === 'function' ? value.bind(target) : value
  },
})
