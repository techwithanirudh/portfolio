'use client'

import type { PlayOptions } from '@web-kits/audio'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import {
  checkbox,
  click,
  collapse,
  error,
  expand,
  pageEnter,
  send,
  tabSwitch,
  tap,
  toggleOff,
  toggleOn,
} from '@/lib/audio/minimal'
import { playSound } from '@/lib/audio/preferences'

const PRESS =
  'a[href], button:not([type="submit"]), [role="tab"], [role="switch"], [role="checkbox"], [aria-expanded]'
const PRESS_OPT_OUT = '[data-sound="off"], [data-sound-press="off"]'
const VALIDATION_DELAY = 120

const jitter = (detune: number, volume: number): PlayOptions => ({
  jitter: { detune, volume },
})

const playPress = (el: Element) => {
  // aria-expanded flips after the click handlers ran, so read it a tick later
  if (el.hasAttribute('aria-expanded')) {
    setTimeout(() => {
      const open = el.getAttribute('aria-expanded') === 'true'
      playSound(open ? expand : collapse, jitter(20, 0.06))
    }, 16)
    return
  }
  const role = el.getAttribute('role')
  if (role === 'tab') {
    playSound(tabSwitch, jitter(30, 0.08))
    return
  }
  if (role === 'switch' || role === 'checkbox') {
    // The state flips after the click handlers ran, so read it a tick later
    const wasChecked = el.getAttribute('aria-checked') === 'true'
    setTimeout(() => {
      const isChecked = el.getAttribute('aria-checked') === 'true'
      if (role === 'checkbox') {
        playSound(checkbox, jitter(20, 0.06))
      } else {
        playSound(
          isChecked || !wasChecked ? toggleOn : toggleOff,
          jitter(20, 0.06)
        )
      }
    }, 16)
    return
  }
  if (el instanceof HTMLButtonElement) {
    playSound(tap, jitter(60, 0.1))
    return
  }
  playSound(click, jitter(60, 0.1))
}

const playSubmit = (form: HTMLFormElement) => {
  setTimeout(() => {
    const invalid = form.querySelector('[aria-invalid="true"]')
    playSound(invalid ? error : send, jitter(20, 0.06))
  }, VALIDATION_DELAY)
}

export function UiSounds() {
  const pathname = usePathname()
  const previousPathname = useRef(pathname)
  const historyNavigation = useRef(false)

  useEffect(() => {
    if (previousPathname.current === pathname) {
      return
    }
    previousPathname.current = pathname
    if (historyNavigation.current) {
      historyNavigation.current = false
      playSound(pageEnter, jitter(30, 0.08))
    }
  }, [pathname])

  useEffect(() => {
    const onPopState = () => {
      historyNavigation.current = true
    }

    const onGesture = () => {
      historyNavigation.current = false
    }

    const onPointerDown = (event: PointerEvent) => {
      onGesture()
      if (event.button !== 0 || !(event.target instanceof Element)) {
        return
      }
      const el = event.target.closest(PRESS)
      if (el && !el.closest(PRESS_OPT_OUT)) {
        playPress(el)
      }
    }

    // Keyboard activation has no pointerdown, a click without a pointer does
    const onClick = (event: MouseEvent) => {
      if (event.detail !== 0 || !(event.target instanceof Element)) {
        return
      }
      const el = event.target.closest(PRESS)
      if (el && !el.closest(PRESS_OPT_OUT)) {
        playPress(el)
      }
    }

    const onSubmit = (event: SubmitEvent) => {
      const form = event.target
      if (form instanceof HTMLFormElement && !form.closest(PRESS_OPT_OUT)) {
        playSubmit(form)
      }
    }

    const onKeyDown = () => {
      onGesture()
    }

    document.addEventListener('pointerdown', onPointerDown, { passive: true })
    document.addEventListener('click', onClick, { passive: true })
    document.addEventListener('keydown', onKeyDown, {
      capture: true,
      passive: true,
    })
    document.addEventListener('submit', onSubmit, { capture: true })
    window.addEventListener('popstate', onPopState)
    return () => {
      window.removeEventListener('popstate', onPopState)
      document.removeEventListener('submit', onSubmit, { capture: true })
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('click', onClick)
      document.removeEventListener('keydown', onKeyDown, { capture: true })
    }
  }, [])

  return null
}
