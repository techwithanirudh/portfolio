'use client'

import { useEffect, useRef } from 'react'
import { useOiiaMode } from './oiia-provider'

const GIF_URL = 'https://media.tenor.com/8VuZc8I8f7EAAAAj/oiia-cat.gif'
const CAT_RADIUS = 34
const INITIAL_CATS = 5
const MAX_CATS = 60
const SPAWN_COOLDOWN_MS = 350
const COLLISION_SPEED_THRESHOLD = 1.2
// biome-ignore lint/suspicious/noBitwiseOperators: Matter.js collision filter requires bitwise flags
const CAT_MASK = 0x00_01 | 0x00_02
// Oversized so they never need rescaling on resize — only position needs updating
const WALL_EXTENT = 20_000

const BURST_COLORS = [
  '#ff6b6b',
  '#ffd93d',
  '#6bcb77',
  '#4d96ff',
  '#ff6bcb',
  '#ff9f43',
]
const PARTICLE_COLORS = [
  '#ff6b6b',
  '#ffd93d',
  '#6bcb77',
  '#4d96ff',
  '#ff6bcb',
  '#a855f7',
  '#ff9f43',
  '#06b6d4',
]

interface EngineState {
  bodies: Map<number, Matter.Body>
  clearing: boolean
  dragBodyId: number | null
  dragConstraint: Matter.Constraint | null
  elements: Map<number, HTMLDivElement>
  engine: Matter.Engine
  lastSpawn: number
  M: typeof import('matter-js')
  nextId: number
  rafId: number
  runner: Matter.Runner
}

function playBoing() {
  try {
    const Ctx =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext
    if (!Ctx) {
      return
    }
    const ctx = new Ctx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(700, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.14)
    gain.gain.setValueAtTime(0.12, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.28)
  } catch {
    // AudioContext unavailable before first user gesture — ignore
  }
}

function burstParticles(container: HTMLDivElement, x: number, y: number) {
  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * Math.PI * 2 + Math.random() * 0.4
    const dist = 55 + Math.random() * 75
    const size = 7 + Math.random() * 9
    const color =
      PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)] ??
      '#fff'
    const p = document.createElement('div')
    // z-index:100 — above cats (z-index:2) so particles are actually visible
    p.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${size}px;height:${size}px;margin-left:-${size / 2}px;margin-top:-${size / 2}px;border-radius:50%;background:${color};pointer-events:none;z-index:100;transition:transform 0.55s cubic-bezier(0.22,1,0.36,1),opacity 0.5s ease-out;will-change:transform,opacity;`
    container.appendChild(p)
    requestAnimationFrame(() => {
      p.style.transform = `translate(${Math.cos(angle) * dist}px,${Math.sin(angle) * dist}px) scale(0)`
      p.style.opacity = '0'
    })
    setTimeout(() => p.remove(), 600)
  }
}

function mountEngine(
  M: typeof import('matter-js'),
  container: HTMLDivElement,
  isOiiaRef: { current: boolean },
  onCountChange: (n: number) => void
): { state: EngineState; cleanup: () => void } {
  const engine = M.Engine.create({ gravity: { x: 0, y: 0 } })
  const runner = M.Runner.create()
  M.Runner.run(runner, engine)

  const w = window.innerWidth
  const h = window.innerHeight

  // Walls are WALL_EXTENT wide/tall so resize only needs a position update, never a scale
  const makeWall = (x: number, y: number, width: number, height: number) =>
    M.Bodies.rectangle(x, y, width, height, {
      isStatic: true,
      label: 'wall',
      restitution: 1,
      friction: 0,
      frictionStatic: 0,
    })

  const [wTop, wBottom, wLeft, wRight] = [
    makeWall(w / 2, -25, WALL_EXTENT, 50),
    makeWall(w / 2, h + 25, WALL_EXTENT, 50),
    makeWall(-25, h / 2, 50, WALL_EXTENT),
    makeWall(w + 25, h / 2, 50, WALL_EXTENT),
  ] as [Matter.Body, Matter.Body, Matter.Body, Matter.Body]
  M.World.add(engine.world, [wTop, wBottom, wLeft, wRight])

  const bodies = new Map<number, Matter.Body>()
  const elements = new Map<number, HTMLDivElement>()

  const state: EngineState = {
    M,
    engine,
    runner,
    bodies,
    elements,
    nextId: 0,
    lastSpawn: 0,
    clearing: false,
    rafId: 0,
    dragConstraint: null,
    dragBodyId: null,
  }

  const spawnCat = (x?: number, y?: number, inheritVx = 0, inheritVy = 0) => {
    if (bodies.size >= MAX_CATS) {
      return
    }
    const id = state.nextId++
    const cx =
      x ?? CAT_RADIUS + Math.random() * (window.innerWidth - CAT_RADIUS * 2)
    const cy =
      y ?? CAT_RADIUS + Math.random() * (window.innerHeight - CAT_RADIUS * 2)

    const body = M.Bodies.circle(cx, cy, CAT_RADIUS, {
      label: 'oiia',
      restitution: 0.9,
      friction: 0,
      frictionAir: 0, // no damping — cats keep their speed indefinitely
      density: 0.002,
      collisionFilter: { category: 0x00_01, mask: CAT_MASK },
    })

    const angle = Math.random() * Math.PI * 2
    const speed = 4 + Math.random() * 3
    M.Body.setVelocity(body, {
      x: inheritVx * 0.4 + Math.cos(angle) * speed,
      y: inheritVy * 0.4 + Math.sin(angle) * speed,
    })
    M.World.add(engine.world, body)

    // position:absolute inside fixed inset-0 container == viewport coordinates,
    // but avoids "fixed-inside-stacking-context" clipping that blocked free movement
    const el = document.createElement('div')
    el.style.cssText = `position:absolute;width:${CAT_RADIUS * 2}px;height:${CAT_RADIUS * 2}px;top:0;left:0;pointer-events:auto;will-change:transform;cursor:grab;z-index:2;border-radius:50%;overflow:hidden;opacity:0;transition:opacity 0.25s ease-out;`
    const img = document.createElement('img')
    img.src = GIF_URL
    img.alt = 'OIIA cat'
    img.style.cssText =
      'width:100%;height:100%;object-fit:cover;pointer-events:none;user-select:none;-webkit-user-drag:none;'
    el.appendChild(img)
    container.appendChild(el)
    // Fade in without touching transform — the RAF loop owns transform exclusively
    requestAnimationFrame(() => {
      el.style.opacity = '1'
    })

    el.addEventListener('pointerdown', (e) => {
      e.stopPropagation()
      if (state.dragConstraint) {
        return
      }
      el.style.cursor = 'grabbing'
      state.dragBodyId = id
      const constraint = M.Constraint.create({
        bodyA: body,
        pointB: { x: e.clientX, y: e.clientY },
        stiffness: 0.06,
        damping: 0.05,
        length: 0,
      })
      M.World.add(engine.world, constraint)
      state.dragConstraint = constraint
    })

    bodies.set(id, body)
    elements.set(id, el)
    onCountChange(bodies.size)
  }

  for (let i = 0; i < INITIAL_CATS; i++) {
    spawnCat()
  }

  M.Events.on(
    engine,
    'collisionStart',
    (event: Matter.IEventCollision<Matter.Engine>) => {
      if (state.clearing || !isOiiaRef.current) {
        return
      }

      for (const { bodyA, bodyB } of event.pairs) {
        if (bodyA.label !== 'oiia' || bodyB.label !== 'oiia') {
          continue
        }

        const relSpeed = Math.hypot(
          bodyA.velocity.x - bodyB.velocity.x,
          bodyA.velocity.y - bodyB.velocity.y
        )
        if (relSpeed < COLLISION_SPEED_THRESHOLD) {
          continue
        }

        // Always boing, even at max cap
        playBoing()

        const now = performance.now()
        if (
          now - state.lastSpawn < SPAWN_COOLDOWN_MS ||
          bodies.size >= MAX_CATS
        ) {
          break
        }

        state.lastSpawn = now
        spawnCat(
          (bodyA.position.x + bodyB.position.x) / 2,
          (bodyA.position.y + bodyB.position.y) / 2,
          (bodyA.velocity.x + bodyB.velocity.x) / 2,
          (bodyA.velocity.y + bodyB.velocity.y) / 2
        )
        break
      }
    }
  )

  // RAF loop: physics positions → DOM transforms, bypassing React reconciliation
  const tick = () => {
    for (const [id, body] of bodies) {
      const el = elements.get(id)
      if (el) {
        el.style.transform = `translate3d(${body.position.x - CAT_RADIUS}px,${body.position.y - CAT_RADIUS}px,0)`
      }
    }
    state.rafId = requestAnimationFrame(tick)
  }
  state.rafId = requestAnimationFrame(tick)

  const onPointerMove = (e: PointerEvent) => {
    if (state.dragConstraint) {
      state.dragConstraint.pointB = { x: e.clientX, y: e.clientY }
    }
  }
  const onPointerUp = () => {
    if (!state.dragConstraint) {
      return
    }
    M.World.remove(engine.world, state.dragConstraint)
    state.dragConstraint = null
    if (state.dragBodyId !== null) {
      elements.get(state.dragBodyId)?.style.setProperty('cursor', 'grab')
      state.dragBodyId = null
    }
  }

  // On resize: only reposition walls (they're oversized, no scale needed).
  // Also clamp any out-of-bounds cats so they don't get trapped outside the new walls.
  const onResize = () => {
    const nw = window.innerWidth
    const nh = window.innerHeight
    M.Body.setPosition(wTop, { x: nw / 2, y: -25 })
    M.Body.setPosition(wBottom, { x: nw / 2, y: nh + 25 })
    M.Body.setPosition(wLeft, { x: -25, y: nh / 2 })
    M.Body.setPosition(wRight, { x: nw + 25, y: nh / 2 })
    for (const [, body] of bodies) {
      const clamped = {
        x: Math.max(CAT_RADIUS, Math.min(nw - CAT_RADIUS, body.position.x)),
        y: Math.max(CAT_RADIUS, Math.min(nh - CAT_RADIUS, body.position.y)),
      }
      if (clamped.x !== body.position.x || clamped.y !== body.position.y) {
        M.Body.setPosition(body, clamped)
      }
    }
  }

  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('pointercancel', onPointerUp)
  window.addEventListener('resize', onResize)

  const cleanup = () => {
    cancelAnimationFrame(state.rafId)
    if (state.dragConstraint) {
      M.World.remove(engine.world, state.dragConstraint)
    }
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
    window.removeEventListener('pointercancel', onPointerUp)
    window.removeEventListener('resize', onResize)
    M.Runner.stop(runner)
    M.Engine.clear(engine)
    container.innerHTML = ''
    onCountChange(0)
  }

  return { state, cleanup }
}

export function OiiaEngine() {
  const { mode, setCatCount, clearAllRequest } = useOiiaMode()
  const isOiia = mode === 'oiia'
  const containerRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef<EngineState | null>(null)
  const cleanupRef = useRef<(() => void) | null>(null)
  const isOiiaRef = useRef(isOiia)

  useEffect(() => {
    isOiiaRef.current = isOiia
  }, [isOiia])

  useEffect(() => {
    if (!isOiia) {
      return
    }
    const container = containerRef.current
    if (!container) {
      return
    }
    let cancelled = false

    import('matter-js').then((M) => {
      if (cancelled) {
        return
      }
      const { state, cleanup } = mountEngine(
        M,
        container,
        isOiiaRef,
        setCatCount
      )
      stateRef.current = state
      cleanupRef.current = cleanup
    })

    return () => {
      cancelled = true
      cleanupRef.current?.()
      cleanupRef.current = null
      stateRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOiia, setCatCount])

  // Holi clear: burst every cat outward with particles, then respawn fresh
  useEffect(() => {
    if (clearAllRequest === 0) {
      return
    }
    const state = stateRef.current
    const container = containerRef.current
    if (!(state && container)) {
      return
    }

    state.clearing = true
    cancelAnimationFrame(state.rafId)
    if (state.dragConstraint) {
      state.M.World.remove(state.engine.world, state.dragConstraint)
      state.dragConstraint = null
    }

    let i = 0
    for (const [, el] of state.elements) {
      const angle =
        (i / state.elements.size) * Math.PI * 2 + (Math.random() - 0.5) * 0.5
      const d = 110 + Math.random() * 80
      const color = BURST_COLORS[i % BURST_COLORS.length] ?? '#fff'
      el.style.transition =
        'transform 0.55s cubic-bezier(0.22,1,0.36,1),opacity 0.5s ease-out'
      el.style.transform = `${el.style.transform} translate(${Math.cos(angle) * d}px,${Math.sin(angle) * d}px) scale(0.2)`
      el.style.opacity = '0'
      el.style.filter = `drop-shadow(0 0 10px ${color})`
      i++
    }
    for (const [, body] of state.bodies) {
      burstParticles(container, body.position.x, body.position.y)
    }

    cleanupRef.current?.()
    cleanupRef.current = null
    stateRef.current = null

    setTimeout(() => {
      if (!(isOiiaRef.current && containerRef.current)) {
        return
      }
      import('matter-js').then((M) => {
        if (!(isOiiaRef.current && containerRef.current)) {
          return
        }
        const { state: s, cleanup } = mountEngine(
          M,
          containerRef.current,
          isOiiaRef,
          setCatCount
        )
        stateRef.current = s
        cleanupRef.current = cleanup
      })
    }, 650)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearAllRequest, setCatCount])

  return (
    <div
      aria-hidden='true'
      className='pointer-events-none fixed inset-0 z-[9998]'
      ref={containerRef}
    />
  )
}
