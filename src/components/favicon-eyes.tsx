'use client'

import { useEffect } from 'react'

// A small easter egg: the favicon is the portrait, and its eyes follow the
// pointer around the page, blink now and then, and shut while you're in
// another tab. Geometry is measured from the 512px icon.
const SOURCE = '/icon.png'
const SIZE = 64
// Drawn at a larger size first so the painted-over eyes leave no seams
const WORK = 256
const SKIN = '#ffe3be'
const INK = '#292929'
const EYES = [
  { x: 157, y: 226 },
  { x: 321, y: 269 },
]
// Each eye is a capsule tilted about 16 degrees off vertical
const EYE = { angle: (16 * Math.PI) / 180, length: 77, width: 29 }
// How far the eyes can wander from rest, in icon pixels
const REACH = { x: 12, y: 10 }

const capsule = (
  context: CanvasRenderingContext2D,
  length: number,
  width: number
) => {
  const half = Math.max(0, length / 2 - width / 2)
  context.beginPath()
  context.moveTo(-width / 2, -half)
  context.arc(0, -half, width / 2, Math.PI, 0)
  context.lineTo(width / 2, half)
  context.arc(0, half, width / 2, 0, Math.PI)
  context.closePath()
  context.fill()
}

export function FaviconEyes() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }
    const links = [
      ...document.querySelectorAll<HTMLLinkElement>('link[rel~="icon"]'),
    ].filter((link) => !link.href.includes('apple'))
    const originals = links.map((link) => link.href)
    const canvas = document.createElement('canvas')
    canvas.width = SIZE
    canvas.height = SIZE
    const work = document.createElement('canvas')
    work.width = WORK
    work.height = WORK
    const output = canvas.getContext('2d')
    const context = work.getContext('2d')
    if (!(context && output && links.length)) {
      return
    }

    const image = new Image()
    let look = { x: 0, y: 0 }
    let closed = document.hidden ? 1 : 0
    let frame = 0
    let lastUrl = ''
    let blinkTimer: ReturnType<typeof setTimeout> | undefined

    const draw = () => {
      frame = 0
      context.setTransform(1, 0, 0, 1, 0, 0)
      context.clearRect(0, 0, WORK, WORK)
      context.drawImage(image, 0, 0, WORK, WORK)
      context.scale(WORK / 512, WORK / 512)
      for (const eye of EYES) {
        // Paint over the drawn eye, then redraw it where it's looking
        context.save()
        context.translate(eye.x, eye.y)
        context.rotate(EYE.angle)
        context.fillStyle = SKIN
        capsule(context, EYE.length + 16, EYE.width + 16)
        context.restore()

        context.save()
        context.translate(eye.x + look.x * REACH.x, eye.y + look.y * REACH.y)
        context.rotate(EYE.angle)
        context.fillStyle = INK
        context.scale(1, 1 - closed * 0.85)
        capsule(context, EYE.length, EYE.width)
        context.restore()
      }
      output.clearRect(0, 0, SIZE, SIZE)
      output.drawImage(work, 0, 0, SIZE, SIZE)
      const url = canvas.toDataURL('image/png')
      if (url !== lastUrl) {
        lastUrl = url
        for (const link of links) {
          link.href = url
        }
      }
    }
    const schedule = () => {
      if (!(frame || !image.complete)) {
        frame = requestAnimationFrame(draw)
      }
    }

    const blink = () => {
      closed = 1
      schedule()
      setTimeout(() => {
        closed = document.hidden ? 1 : 0
        schedule()
      }, 140)
      blinkTimer = setTimeout(blink, 2500 + Math.random() * 4000)
    }

    const onPointerMove = (event: PointerEvent) => {
      const clamp = (value: number) => Math.max(-1, Math.min(1, value))
      look = {
        x: clamp((event.clientX / window.innerWidth) * 2 - 1),
        y: clamp((event.clientY / window.innerHeight) * 2 - 1),
      }
      schedule()
    }
    const onLeave = () => {
      look = { x: 0, y: 0 }
      schedule()
    }
    const onVisibility = () => {
      closed = document.hidden ? 1 : 0
      // Background tabs don't paint frames, so draw right away
      draw()
    }

    image.onload = () => {
      draw()
      blinkTimer = setTimeout(blink, 2000)
    }
    image.src = SOURCE

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(blinkTimer)
      window.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
      links.forEach((link, index) => {
        link.href = originals[index] ?? link.href
      })
    }
  }, [])

  return null
}
