'use client'

import { useEffect, useRef, useState } from 'react'
import { preload } from 'react-dom'

// Matches public/images/portrait.svg: the drawing minus the eyes and the sky,
// which is painted behind it as a CSS gradient (the cover shader's palette in
// dark mode)
const VIEW_BOX = '0 0 947 1160'
// How far (in SVG units) the eyes can drift towards the cursor
const MAX_OFFSET = 24
// Cursor distance (in px) at which the eyes reach MAX_OFFSET
const REACH = 320

// Portrait whose eyes follow the cursor around the page
const SRC = '/images/portrait.svg'

export function Portrait() {
  // Start fetching the drawing with the HTML, it's above the fold
  preload(SRC, { as: 'image', fetchPriority: 'high' })
  const eyesRef = useRef<SVGGElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  // The eyes are inline, so they'd show before the face loads without this
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const image = imageRef.current
    if (!image) {
      return
    }
    if (image.complete) {
      setLoaded(true)
      return
    }
    const onLoad = () => setLoaded(true)
    image.addEventListener('load', onLoad)
    return () => image.removeEventListener('load', onLoad)
  }, [])

  useEffect(() => {
    const eyes = eyesRef.current
    if (
      !eyes ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }

    let frame = 0
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const rect = eyes.getBoundingClientRect()
        const dx = event.clientX - (rect.left + rect.width / 2)
        const dy = event.clientY - (rect.top + rect.height / 2)
        const distance = Math.hypot(dx, dy) || 1
        const reach = Math.min(distance / REACH, 1) * MAX_OFFSET
        eyes.style.translate = `${(dx / distance) * reach}px ${(dy / distance) * reach}px`
      })
    }
    const onLeave = () => {
      eyes.style.translate = ''
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div className='relative size-full select-none bg-[linear-gradient(160deg,#c3b6fa,#9fccfa_55%,#7fd0f5)] dark:bg-[linear-gradient(160deg,#7f5ce0,#5a7fe0_55%,#38a8e6)]'>
      {/* biome-ignore lint/performance/noImgElement: static SVG, next/image adds nothing here */}
      <img
        alt='Portrait of Anirudh Sriram'
        className='relative size-full object-cover'
        draggable={false}
        fetchPriority='high'
        height={1160}
        ref={imageRef}
        src={SRC}
        width={947}
      />
      <svg
        aria-hidden
        className='pointer-events-none absolute inset-0 size-full opacity-0 data-loaded:opacity-100'
        data-loaded={loaded ? '' : undefined}
        preserveAspectRatio='xMidYMid slice'
        viewBox={VIEW_BOX}
      >
        <g
          className='transition-[translate] duration-300 ease-out'
          fill='#292929'
          ref={eyesRef}
        >
          <g className='[&>path]:origin-center [&>path]:animate-blink [&>path]:[transform-box:fill-box] motion-reduce:[&>path]:animate-none'>
            <path d='m291 487c5-14 16-23 27-22 16 0 27 15 23 32-4 19-16 57-23 79-4 14-16 22-29 19-14-3-23-15-19-31 5-22 15-56 21-77z' />
            <path d='m570 564c4-15 16-25 28-24 15-1 25 11 23 28-1 10-6 24-10 38l-12 39c-4 14-16 24-28 22-15-2-24-13-22-28 3-13 7-27 11-40z' />
          </g>
        </g>
      </svg>
    </div>
  )
}
