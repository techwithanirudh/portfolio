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
  hover as hoverSound,
  keyPress,
  pageEnter,
  send,
  tabSwitch,
  tap,
  toggleOff,
  toggleOn,
} from '@/lib/audio/mechanical'
import { playSound } from '@/lib/audio/preferences'

const PRESS =
  'a[href], button:not([type="submit"]), [role="tab"], [role="switch"], [role="checkbox"], [aria-expanded]'
const HOVER = '[data-sound-hover], header a[href], footer a[href]'
const OPT_OUT = '[data-sound="off"]'
// For components that already play their own sound on press or submit
const PRESS_OPT_OUT = '[data-sound="off"], [data-sound-press="off"]'
const HOVER_GAP = 45
// Long enough for a client side validator to flag its fields
const VALIDATION_DELAY = 120

// Repeated plays of one sound should not feel like a sample loop
const jitter = (detune: number, volume: number): PlayOptions => ({
  jitter: { detune, volume },
})

const isTextField = (el: EventTarget | null): el is HTMLElement => {
  if (!(el instanceof HTMLElement)) {
    return false
  }
  return (
    el.isContentEditable ||
    el instanceof HTMLTextAreaElement ||
    (el instanceof HTMLInputElement &&
      ['text', 'search', 'email', 'url', 'tel', 'password', 'number'].includes(
        el.type
      ))
  )
}

const playPress = (el: Element) => {
  // Accordions, menus and popovers: the trigger says where it is heading
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

// A submit either trips the validator, which marks fields aria-invalid, or
// goes through. Server results are voiced by the toast that follows.
const playSubmit = (form: HTMLFormElement) => {
  setTimeout(() => {
    const invalid = form.querySelector('[aria-invalid="true"]')
    playSound(invalid ? error : send, jitter(20, 0.06))
  }, VALIDATION_DELAY)
}

// One set of document listeners gives every link, button, disclosure, form,
// tab, switch and text field
// the same tactile feedback, so new components get sound without wiring it up.
// Components that play their own sound simply are not links, tabs or switches.
export function UiSounds() {
  const pathname = usePathname()
  const previousPath = useRef(pathname)

  useEffect(() => {
    if (previousPath.current === pathname) {
      return
    }
    previousPath.current = pathname
    playSound(pageEnter, jitter(20, 0.05))
  }, [pathname])

  useEffect(() => {
    let lastHover = 0
    let lastHovered: Element | null = null

    const onPointerDown = (event: PointerEvent) => {
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

    const onPointerOver = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !(event.target instanceof Element)) {
        return
      }
      const el = event.target.closest(HOVER)
      const now = performance.now()
      if (!el || el === lastHovered || el.closest(OPT_OUT)) {
        lastHovered = el
        return
      }
      lastHovered = el
      if (now - lastHover > HOVER_GAP) {
        lastHover = now
        playSound(hoverSound, jitter(80, 0.2))
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.repeat ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        !isTextField(event.target) ||
        event.target.closest(OPT_OUT)
      ) {
        return
      }
      if (event.key.length === 1 || event.key === 'Backspace') {
        playSound(keyPress, jitter(120, 0.15))
      } else if (event.key === 'Enter') {
        playSound(click, jitter(40, 0.1))
      }
    }

    document.addEventListener('pointerdown', onPointerDown, { passive: true })
    document.addEventListener('click', onClick, { passive: true })
    document.addEventListener('pointerover', onPointerOver, { passive: true })
    document.addEventListener('keydown', onKeyDown, { passive: true })
    document.addEventListener('submit', onSubmit, { capture: true })
    return () => {
      document.removeEventListener('submit', onSubmit, { capture: true })
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('click', onClick)
      document.removeEventListener('pointerover', onPointerOver)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return null
}
