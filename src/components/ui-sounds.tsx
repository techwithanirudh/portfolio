'use client'

import type { PlayOptions } from '@web-kits/audio'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import {
  checkbox,
  click,
  hover as hoverSound,
  keyPress,
  pageEnter,
  tabSwitch,
  toggleOff,
  toggleOn,
} from '@/lib/audio/mechanical'
import { playSound } from '@/lib/audio/preferences'

const PRESS = 'a[href], [role="tab"], [role="switch"], [role="checkbox"]'
const HOVER = '[data-sound-hover], header a[href], footer a[href]'
const OPT_OUT = '[data-sound="off"]'
const HOVER_GAP = 45

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
  playSound(click, jitter(60, 0.1))
}

// One set of document listeners gives every link, tab, switch and text field
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
      if (el && !el.closest(OPT_OUT)) {
        playPress(el)
      }
    }

    // Keyboard activation has no pointerdown, a click without a pointer does
    const onClick = (event: MouseEvent) => {
      if (event.detail !== 0 || !(event.target instanceof Element)) {
        return
      }
      const el = event.target.closest(PRESS)
      if (el && !el.closest(OPT_OUT)) {
        playPress(el)
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
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('click', onClick)
      document.removeEventListener('pointerover', onPointerOver)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return null
}
