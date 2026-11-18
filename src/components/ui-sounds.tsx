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

const jitter = {
  navigate: { jitter: { detune: 30, volume: 0.08 } },
  press: { jitter: { detune: 60, volume: 0.1 } },
  state: { jitter: { detune: 20, volume: 0.06 } },
} satisfies Record<string, PlayOptions>

const playPress = (target: Element) => {
  const el = target.closest(PRESS)
  if (!el || el.closest(PRESS_OPT_OUT)) {
    return
  }
  const role = el.getAttribute('role')
  const isChecked = () => el.getAttribute('aria-checked') === 'true'

  // aria state flips after the click handlers ran, so the stateful presses
  // read it a tick (16ms) later
  if (el.hasAttribute('aria-expanded')) {
    setTimeout(() => {
      const open = el.getAttribute('aria-expanded') === 'true'
      playSound(open ? expand : collapse, jitter.state)
    }, 16)
  } else if (role === 'checkbox') {
    setTimeout(() => playSound(checkbox, jitter.state), 16)
  } else if (role === 'switch') {
    const wasChecked = isChecked()
    setTimeout(() => {
      const turnedOff = wasChecked && !isChecked()
      playSound(turnedOff ? toggleOff : toggleOn, jitter.state)
    }, 16)
  } else if (role === 'tab') {
    playSound(tabSwitch, jitter.navigate)
  } else {
    playSound(el instanceof HTMLButtonElement ? tap : click, jitter.press)
  }
}

const playSubmit = (event: SubmitEvent) => {
  const form = event.target
  if (form instanceof HTMLFormElement && !form.closest(PRESS_OPT_OUT)) {
    // Wait for validation to mark the invalid fields
    setTimeout(() => {
      const invalid = form.querySelector('[aria-invalid="true"]')
      playSound(invalid ? error : send, jitter.state)
    }, 120)
  }
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
      playSound(pageEnter, jitter.navigate)
    }
  }, [pathname])

  useEffect(() => {
    const onPopState = () => {
      historyNavigation.current = true
    }

    const onGesture = () => {
      historyNavigation.current = false
    }

    // A finger lands on pointerdown even when it is starting a scroll, so touch
    // presses sound on the click that follows a real tap instead
    let touchPress = false

    const onPointerDown = (event: PointerEvent) => {
      onGesture()
      touchPress = event.pointerType === 'touch'
      if (
        touchPress ||
        event.button !== 0 ||
        !(event.target instanceof Element)
      ) {
        return
      }
      playPress(event.target)
    }

    // Keyboard activation has no pointerdown, a click without a pointer does
    const onClick = (event: MouseEvent) => {
      if (
        (event.detail !== 0 && !touchPress) ||
        !(event.target instanceof Element)
      ) {
        return
      }
      touchPress = false
      playPress(event.target)
    }

    document.addEventListener('pointerdown', onPointerDown, { passive: true })
    document.addEventListener('click', onClick, { passive: true })
    document.addEventListener('keydown', onGesture, {
      capture: true,
      passive: true,
    })
    document.addEventListener('submit', playSubmit, { capture: true })
    window.addEventListener('popstate', onPopState)
    return () => {
      window.removeEventListener('popstate', onPopState)
      document.removeEventListener('submit', playSubmit, { capture: true })
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('click', onClick)
      document.removeEventListener('keydown', onGesture, { capture: true })
    }
  }, [])

  return null
}
