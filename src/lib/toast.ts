import { toast as sonnerToast } from 'sonner'
import { error, success, tap, warning } from '@/lib/audio/minimal'
import { playSound } from '@/lib/audio/preferences'

type SonnerToast = typeof sonnerToast

const variantSounds = { error, success, warning }

type Variant = keyof typeof variantSounds

const isVariant = (prop: PropertyKey): prop is Variant =>
  Object.hasOwn(variantSounds, prop)

// Errors stay twice Sonner's 4 s default, long enough to read the next step
const ERROR_DURATION_MS = 8000

export const toast: SonnerToast = new Proxy(sonnerToast, {
  apply(target, thisArg, args) {
    playSound(tap)
    return Reflect.apply(target, thisArg, args)
  },
  get(target, prop, receiver) {
    if (isVariant(prop)) {
      const show: SonnerToast['success'] = sonnerToast[prop]
      return (...[message, data]: Parameters<typeof show>) => {
        playSound(variantSounds[prop])
        return show(
          message,
          prop === 'error' ? { duration: ERROR_DURATION_MS, ...data } : data
        )
      }
    }
    const value = Reflect.get(target, prop, receiver)
    return typeof value === 'function' ? value.bind(target) : value
  },
})
