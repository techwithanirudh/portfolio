'use client'

import { useEffect, useRef } from 'react'
import { useOiiaMode } from './oiia-provider'

const GIF_URL = 'https://media.tenor.com/8VuZc8I8f7EAAAAj/oiia-cat.gif'
const CAT_RADIUS = 34
const INITIAL_CATS = 3
const MAX_CATS = 60
const SPAWN_COOLDOWN_MS = 350
const COLLISION_VELOCITY_THRESHOLD = 0.8
// biome-ignore lint/suspicious/noBitwiseOperators: Matter.js collision filter requires bitwise flags
const CAT_COLLISION_MASK = 0x00_01 | 0x00_02

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

function playBoingSound() {
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
    // AudioContext may be suspended before first user interaction
  }
}

function spawnHoliParticles(container: HTMLDivElement, x: number, y: number) {
  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * Math.PI * 2 + Math.random() * 0.3
    const distance = 60 + Math.random() * 80
    const size = 8 + Math.random() * 10
    const color =
      PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)] ??
      '#fff'
    const particle = document.createElement('div')
    particle.style.cssText = `position:fixed;left:${x - size / 2}px;top:${y - size / 2}px;width:${size}px;height:${size}px;border-radius:50%;background:${color};pointer-events:none;z-index:10001;transition:transform 0.55s cubic-bezier(0.22,1,0.36,1),opacity 0.5s ease-out;will-change:transform,opacity;`
    container.appendChild(particle)
    requestAnimationFrame(() => {
      particle.style.transform = `translate(${Math.cos(angle) * distance}px,${Math.sin(angle) * distance}px) scale(0)`
      particle.style.opacity = '0'
    })
    setTimeout(() => particle.remove(), 600)
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

  const makeWall = (x: number, y: number, width: number, height: number) =>
    M.Bodies.rectangle(x, y, width, height, {
      isStatic: true,
      label: 'wall',
      restitution: 0.55,
      friction: 0.05,
      frictionStatic: 0,
    })

  const [wallTop, wallBottom, wallLeft, wallRight] = [
    makeWall(w / 2, -25, w + 200, 50),
    makeWall(w / 2, h + 25, w + 200, 50),
    makeWall(-25, h / 2, 50, h + 200),
    makeWall(w + 25, h / 2, 50, h + 200),
  ] as [Matter.Body, Matter.Body, Matter.Body, Matter.Body]
  M.World.add(engine.world, [wallTop, wallBottom, wallLeft, wallRight])

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

  const spawnCat = (x?: number, y?: number, vx = 0, vy = 0) => {
    if (bodies.size >= MAX_CATS) {
      return
    }
    const id = state.nextId++
    const cx =
      x ?? Math.random() * (window.innerWidth - CAT_RADIUS * 2) + CAT_RADIUS
    const cy =
      y ?? Math.random() * (window.innerHeight - CAT_RADIUS * 2) + CAT_RADIUS

    const body = M.Bodies.circle(cx, cy, CAT_RADIUS, {
      label: 'oiia',
      restitution: 0.75,
      friction: 0.01,
      frictionAir: 0.001,
      density: 0.002,
      collisionFilter: { category: 0x00_01, mask: CAT_COLLISION_MASK },
    })
    const spawnAngle = Math.random() * Math.PI * 2
    const spawnSpeed = 3 + Math.random() * 4
    M.Body.setVelocity(body, {
      x: vx + Math.cos(spawnAngle) * spawnSpeed,
      y: vy + Math.sin(spawnAngle) * spawnSpeed,
    })
    M.World.add(engine.world, body)

    const el = document.createElement('div')
    el.style.cssText = `position:fixed;width:${CAT_RADIUS * 2}px;height:${CAT_RADIUS * 2}px;top:0;left:0;pointer-events:auto;will-change:transform;cursor:grab;z-index:9999;border-radius:50%;overflow:hidden;animation:oiia-birth-pop 0.4s cubic-bezier(0.34,1.56,0.64,1);`
    const img = document.createElement('img')
    img.src = GIF_URL
    img.alt = 'OIIA cat'
    img.style.cssText =
      'width:100%;height:100%;object-fit:cover;pointer-events:none;user-select:none;-webkit-user-drag:none;'
    el.appendChild(img)
    container.appendChild(el)

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
        stiffness: 0.07,
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
      const now = performance.now()
      if (
        now - state.lastSpawn < SPAWN_COOLDOWN_MS ||
        bodies.size >= MAX_CATS
      ) {
        return
      }

      for (const pair of event.pairs) {
        const { bodyA, bodyB } = pair
        if (bodyA.label !== 'oiia' || bodyB.label !== 'oiia') {
          continue
        }
        const relSpeed = Math.hypot(
          bodyA.velocity.x - bodyB.velocity.x,
          bodyA.velocity.y - bodyB.velocity.y
        )
        if (relSpeed < COLLISION_VELOCITY_THRESHOLD) {
          continue
        }
        state.lastSpawn = now
        spawnCat(
          (bodyA.position.x + bodyB.position.x) / 2,
          (bodyA.position.y + bodyB.position.y) / 2
        )
        playBoingSound()
        break
      }
    }
  )

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
      elements
        .get(state.dragBodyId)
        ?.setAttribute(
          'style',
          elements
            .get(state.dragBodyId)!
            .style.cssText.replace('cursor:grabbing', 'cursor:grab')
        )
      state.dragBodyId = null
    }
  }
  const onResize = () => {
    const nw = window.innerWidth
    const nh = window.innerHeight
    M.Body.setPosition(wallTop, { x: nw / 2, y: -25 })
    M.Body.setPosition(wallBottom, { x: nw / 2, y: nh + 25 })
    M.Body.setPosition(wallLeft, { x: -25, y: nh / 2 })
    M.Body.setPosition(wallRight, { x: nw + 25, y: nh / 2 })
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
  const engineStateRef = useRef<EngineState | null>(null)
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
      engineStateRef.current = state
      cleanupRef.current = cleanup
    })

    return () => {
      cancelled = true
      cleanupRef.current?.()
      cleanupRef.current = null
      engineStateRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOiia, setCatCount])

  // Holi-style clear animation
  useEffect(() => {
    if (clearAllRequest === 0) {
      return
    }
    const state = engineStateRef.current
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
      const d = 120 + Math.random() * 80
      const color = BURST_COLORS[i % BURST_COLORS.length] ?? '#fff'
      el.style.transition =
        'transform 0.55s cubic-bezier(0.22,1,0.36,1),opacity 0.55s ease-out'
      el.style.transform = `${el.style.transform} translate(${Math.cos(angle) * d}px,${Math.sin(angle) * d}px) scale(0.3)`
      el.style.opacity = '0'
      el.style.filter = `drop-shadow(0 0 12px ${color})`
      i++
    }

    for (const [, body] of state.bodies) {
      spawnHoliParticles(container, body.position.x, body.position.y)
    }

    cleanupRef.current?.()
    cleanupRef.current = null
    engineStateRef.current = null

    setTimeout(() => {
      if (!(isOiiaRef.current && containerRef.current)) {
        return
      }
      import('matter-js').then((M) => {
        if (!(isOiiaRef.current && containerRef.current)) {
          return
        }
        const { state: newState, cleanup } = mountEngine(
          M,
          containerRef.current,
          isOiiaRef,
          setCatCount
        )
        engineStateRef.current = newState
        cleanupRef.current = cleanup
      })
    }, 650)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearAllRequest, setCatCount])

  return (
    <div
      aria-hidden='true'
      className='pointer-events-none fixed inset-0 z-[9998] overflow-hidden'
      ref={containerRef}
    />
  )
}
