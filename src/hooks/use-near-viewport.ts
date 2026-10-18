import { type RefObject, useEffect, useState } from 'react'

// TODO(slopradar): library-exists: usehooks-ts (a dependency) ships useIntersectionObserver({ rootMargin, freezeOnceVisible: true }), which is this hook; use it at the one caller (blog/[slug]/page.client.tsx) and delete this file
/**
 * Flips to true once the element comes within `rootMargin` of the viewport
 * and stays there, so heavy below-the-fold work can wait until it's needed
 * without the user ever catching it unmounted
 */
export function useNearViewport(
  ref: RefObject<Element | null>,
  rootMargin = '100% 0px'
) {
  const [near, setNear] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element || near) {
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setNear(true)
        }
      },
      { rootMargin }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [near, ref, rootMargin])

  return near
}
