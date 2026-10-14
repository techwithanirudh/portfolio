import { toast as sonnerToast } from 'sonner'
import { error, success, tap, warning } from '@/lib/audio/mechanical'
import { playSound } from '@/lib/audio/preferences'

type SonnerToast = typeof sonnerToast

export const toast: SonnerToast = new Proxy(sonnerToast, {
  apply(target, thisArg, args) {
    playSound(tap)
    return Reflect.apply(target, thisArg, args)
  },
  get(target, prop, receiver) {
    const value = Reflect.get(target, prop, receiver)
    if (prop === 'success') {
      return (...args: Parameters<SonnerToast['success']>) => {
        playSound(success)
        return sonnerToast.success(...args)
      }
    }
    if (prop === 'error') {
      return (...args: Parameters<SonnerToast['error']>) => {
        playSound(error)
        return sonnerToast.error(...args)
      }
    }
    if (prop === 'warning') {
      return (...args: Parameters<SonnerToast['warning']>) => {
        playSound(warning)
        return sonnerToast.warning(...args)
      }
    }
    return typeof value === 'function' ? value.bind(target) : value
  },
}) as SonnerToast
