'use client'

import { useEffect } from 'react'

// Next ignores back or forward onto a #hash entry that lacks the router's state, so
// the new entry gets a copy of the state from the entry the link left
export function HashLinkHistory() {
  useEffect(() => {
    let left: { path: string; state: unknown } | undefined
    const path = () => window.location.pathname + window.location.search

    const onClick = (event: MouseEvent) => {
      // Firefox also clears the state when the current hash is clicked again,
      // with no event, so the next click mends it before anything navigates
      if (window.history.state === null && left?.path === path()) {
        window.history.replaceState(left.state, '', window.location.href)
      }
      const { state } = window.history
      const hashLink =
        event.target instanceof Element && event.target.closest('a[href*="#"]')
      if (hashLink && state?.__NA) {
        left = { path: path(), state }
      }
    }

    // The fragment navigation fires popstate with a null state; Firefox runs
    // it a task after the click, so a timer could miss it
    const onPopState = (event: PopStateEvent) => {
      if (event.state === null && left?.path === path()) {
        window.history.replaceState(left.state, '', window.location.href)
      }
      left = undefined
    }

    document.addEventListener('click', onClick, { capture: true })
    window.addEventListener('popstate', onPopState)
    return () => {
      document.removeEventListener('click', onClick, { capture: true })
      window.removeEventListener('popstate', onPopState)
    }
  }, [])

  return null
}
