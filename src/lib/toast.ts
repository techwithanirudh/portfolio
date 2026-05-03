import { defineSound, ensureReady } from '@web-kits/audio'
import { toast as sonnerToast } from 'sonner'
import { error, success, tap, warning } from '@/lib/audio/minimal'

const _playSuccess = defineSound(success)
const _playError = defineSound(error)
const _playTap = defineSound(tap)
const _playWarning = defineSound(warning)

function play(fn: () => void) {
  ensureReady()
    .then(() => fn())
    .catch(() => {
      // Browsers can reject audio until a trusted user gesture has occurred.
    })
}

type SonnerToast = typeof sonnerToast

export const toast: SonnerToast = new Proxy(sonnerToast, {
  apply(target, thisArg, args) {
    play(_playTap)
    return Reflect.apply(target, thisArg, args)
  },
  get(target, prop, receiver) {
    const value = Reflect.get(target, prop, receiver)
    if (prop === 'success') {
      return (...args: Parameters<SonnerToast['success']>) => {
        play(_playSuccess)
        return sonnerToast.success(...args)
      }
    }
    if (prop === 'error') {
      return (...args: Parameters<SonnerToast['error']>) => {
        play(_playError)
        return sonnerToast.error(...args)
      }
    }
    if (prop === 'warning') {
      return (...args: Parameters<SonnerToast['warning']>) => {
        play(_playWarning)
        return sonnerToast.warning(...args)
      }
    }
    return typeof value === 'function' ? value.bind(target) : value
  },
}) as SonnerToast
