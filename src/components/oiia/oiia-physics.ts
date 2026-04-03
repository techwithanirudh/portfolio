const GIF = 'https://media.tenor.com/8VuZc8I8f7EAAAAj/oiia-cat.gif'
const INITIAL = 5
const MAX = 60
const COOLDOWN = 350
const SPEED_THRESHOLD = 1.2
// biome-ignore lint/suspicious/noBitwiseOperators: Matter.js collision filter requires bitwise flags
const CAT_MASK = 0x00_01 | 0x00_02
const WALL_SIZE = 20_000
const IMMUNITY_MS = 5000

const BURST_COLORS = [
  '#ff6b6b',
  '#ffd93d',
  '#6bcb77',
  '#4d96ff',
  '#ff6bcb',
  '#ff9f43',
]

function pickRadius(): number {
  const t = Math.random()
  if (t < 0.18) {
    return 24 + Math.floor(Math.random() * 7) // small: 24–30
  }
  if (t < 0.72) {
    return 30 + Math.floor(Math.random() * 9) // medium: 30–38
  }
  if (t < 0.92) {
    return 42 + Math.floor(Math.random() * 12) // large: 42–53
  }
  return 56 + Math.floor(Math.random() * 16) // huge: 56–71
}

export interface OiiaEngine {
  clear: (onDone: () => void) => void
  destroy: () => void
}

// Reuse one AudioContext so each boing doesn't pay construction latency
let sharedCtx: AudioContext | null = null
function boing() {
  try {
    const Ctx =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext
    if (!Ctx) {
      return
    }
    sharedCtx ??= new Ctx()
    if (sharedCtx.state === 'suspended') {
      sharedCtx.resume()
    }
    const osc = sharedCtx.createOscillator()
    const gain = sharedCtx.createGain()
    osc.connect(gain)
    gain.connect(sharedCtx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(700, sharedCtx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(
      220,
      sharedCtx.currentTime + 0.14
    )
    gain.gain.setValueAtTime(0.12, sharedCtx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, sharedCtx.currentTime + 0.28)
    osc.start(sharedCtx.currentTime)
    osc.stop(sharedCtx.currentTime + 0.28)
  } catch {
    /* unavailable before first user gesture */
  }
}

export function createOiiaEngine(
  M: typeof import('matter-js'),
  container: HTMLDivElement,
  onCount: (n: number) => void
): OiiaEngine {
  const engine = M.Engine.create({ gravity: { x: 0, y: 0 } })
  const runner = M.Runner.create()
  M.Runner.run(runner, engine)

  const w = window.innerWidth
  const h = window.innerHeight

  const wall = (x: number, y: number, wide: boolean) =>
    M.Bodies.rectangle(x, y, wide ? WALL_SIZE : 50, wide ? 50 : WALL_SIZE, {
      isStatic: true,
      label: 'wall',
      restitution: 1,
      friction: 0,
      frictionStatic: 0,
    })

  const [wT, wB, wL, wR] = [
    wall(w / 2, -25, true),
    wall(w / 2, h + 25, true),
    wall(-25, h / 2, false),
    wall(w + 25, h / 2, false),
  ] as [Matter.Body, Matter.Body, Matter.Body, Matter.Body]
  M.World.add(engine.world, [wT, wB, wL, wR])

  const bodies = new Map<number, Matter.Body>()
  const els = new Map<number, HTMLDivElement>()
  const radii = new Map<number, number>()
  const bodyToId = new Map<Matter.Body, number>()
  const immuneUntil = new Map<number, number>()
  const immunityTimeouts = new Map<number, number>()
  let nextId = 0,
    lastSpawn = 0,
    clearing = false
  let rafId = 0,
    drag: Matter.Constraint | null = null,
    dragId: number | null = null

  function spawnCat(x?: number, y?: number, halo?: string) {
    if (bodies.size >= MAX) {
      return
    }
    const id = nextId++
    const r = pickRadius()
    const cx = x ?? r + Math.random() * (window.innerWidth - r * 2)
    const cy = y ?? r + Math.random() * (window.innerHeight - r * 2)

    const body = M.Bodies.circle(cx, cy, r, {
      label: 'oiia',
      restitution: 1,
      friction: 0,
      frictionAir: 0,
      density: 0.002,
      collisionFilter: { category: 0x00_01, mask: CAT_MASK },
    })
    const angle = Math.random() * Math.PI * 2
    M.Body.setVelocity(body, { x: Math.cos(angle) * 6, y: Math.sin(angle) * 6 })
    M.World.add(engine.world, body)

    const el = document.createElement('div')
    if (halo) {
      el.style.filter = `drop-shadow(0 0 10px ${halo})`
    }
    // Start translated offscreen so no flash at (0,0) before the RAF loop positions it
    el.style.cssText = `${el.style.cssText}position:absolute;width:${r * 2}px;height:${r * 2}px;top:0;left:0;pointer-events:auto;will-change:transform;cursor:grab;z-index:2;opacity:0;transition:opacity 0.2s ease-out;transform:translate3d(-9999px,-9999px,0);`
    const img = document.createElement('img')
    img.src = GIF
    img.alt = 'OIIA cat'
    img.style.cssText =
      'width:100%;height:100%;object-fit:contain;pointer-events:none;user-select:none;-webkit-user-drag:none;'
    el.appendChild(img)
    container.appendChild(el)
    requestAnimationFrame(() => {
      el.style.opacity = '1'
    })

    el.addEventListener('pointerdown', (e) => {
      e.stopPropagation()
      if (drag) {
        return
      }
      el.style.cursor = 'grabbing'
      dragId = id
      drag = M.Constraint.create({
        bodyA: body,
        pointB: { x: e.clientX, y: e.clientY },
        stiffness: 0.06,
        damping: 0.05,
        length: 0,
      })
      M.World.add(engine.world, drag)
    })

    bodies.set(id, body)
    els.set(id, el)
    radii.set(id, r)
    bodyToId.set(body, id)
    if (halo) {
      immuneUntil.set(id, performance.now() + IMMUNITY_MS)
      const timeoutId = window.setTimeout(() => {
        immuneUntil.delete(id)
        immunityTimeouts.delete(id)
        const elRef = els.get(id)
        if (elRef) {
          elRef.style.transition = 'filter 0.8s ease-out'
          elRef.style.filter = ''
        }
      }, IMMUNITY_MS)
      immunityTimeouts.set(id, timeoutId)
    }
    onCount(bodies.size)
  }

  for (let i = 0; i < INITIAL; i++) {
    spawnCat()
  }

  M.Events.on(
    engine,
    'collisionStart',
    (ev: Matter.IEventCollision<Matter.Engine>) => {
      if (clearing) {
        return
      }
      for (const { bodyA, bodyB } of ev.pairs) {
        if (bodyA.label !== 'oiia' || bodyB.label !== 'oiia') {
          continue
        }
        const rel = Math.hypot(
          bodyA.velocity.x - bodyB.velocity.x,
          bodyA.velocity.y - bodyB.velocity.y
        )
        if (rel < SPEED_THRESHOLD) {
          continue
        }
        boing()
        const now = performance.now()
        if (now - lastSpawn < COOLDOWN || bodies.size >= MAX) {
          break
        }
        const idA = bodyToId.get(bodyA)
        const idB = bodyToId.get(bodyB)
        if (
          (idA !== undefined && (immuneUntil.get(idA) ?? 0) > now) ||
          (idB !== undefined && (immuneUntil.get(idB) ?? 0) > now)
        ) {
          break
        }
        lastSpawn = now
        const halo =
          BURST_COLORS[Math.floor(Math.random() * BURST_COLORS.length)]
        spawnCat(
          (bodyA.position.x + bodyB.position.x) / 2,
          (bodyA.position.y + bodyB.position.y) / 2,
          halo
        )
        break
      }
    }
  )

  const tick = () => {
    for (const [id, body] of bodies) {
      const el = els.get(id)
      const r = radii.get(id) ?? 34
      if (el) {
        el.style.transform = `translate3d(${body.position.x - r}px,${body.position.y - r}px,0)`
      }
    }
    rafId = requestAnimationFrame(tick)
  }
  rafId = requestAnimationFrame(tick)

  const onMove = (e: PointerEvent) => {
    if (drag) {
      drag.pointB = { x: e.clientX, y: e.clientY }
    }
  }
  const onUp = () => {
    if (!drag) {
      return
    }
    M.World.remove(engine.world, drag)
    drag = null
    if (dragId !== null) {
      els.get(dragId)?.style.setProperty('cursor', 'grab')
      dragId = null
    }
  }
  const onResize = () => {
    const nw = window.innerWidth,
      nh = window.innerHeight
    M.Body.setPosition(wT, { x: nw / 2, y: -25 })
    M.Body.setPosition(wB, { x: nw / 2, y: nh + 25 })
    M.Body.setPosition(wL, { x: -25, y: nh / 2 })
    M.Body.setPosition(wR, { x: nw + 25, y: nh / 2 })
    for (const [id, body] of bodies) {
      const r = radii.get(id) ?? 34
      M.Body.setPosition(body, {
        x: Math.max(r, Math.min(nw - r, body.position.x)),
        y: Math.max(r, Math.min(nh - r, body.position.y)),
      })
    }
  }

  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onUp)
  window.addEventListener('pointercancel', onUp)
  window.addEventListener('resize', onResize)

  function teardown() {
    cancelAnimationFrame(rafId)
    if (drag) {
      M.World.remove(engine.world, drag)
    }
    for (const timeoutId of immunityTimeouts.values()) {
      window.clearTimeout(timeoutId)
    }
    immunityTimeouts.clear()
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', onUp)
    window.removeEventListener('pointercancel', onUp)
    window.removeEventListener('resize', onResize)
    M.Runner.stop(runner)
    M.Engine.clear(engine)
  }

  return {
    destroy() {
      teardown()
      container.innerHTML = ''
      onCount(0)
    },
    clear(onDone) {
      clearing = true
      cancelAnimationFrame(rafId)
      if (drag) {
        M.World.remove(engine.world, drag)
        drag = null
      }

      let i = 0
      for (const [, el] of els) {
        const angle = (i / els.size) * Math.PI * 2 + (Math.random() - 0.5) * 0.5
        const d = 110 + Math.random() * 80
        const color = BURST_COLORS[i % BURST_COLORS.length] ?? '#fff'
        el.style.transition =
          'transform 0.55s cubic-bezier(0.22,1,0.36,1),opacity 0.5s ease-out'
        el.style.transform = `${el.style.transform} translate(${Math.cos(angle) * d}px,${Math.sin(angle) * d}px) scale(0.2)`
        el.style.opacity = '0'
        el.style.filter = `drop-shadow(0 0 10px ${color})`
        i++
      }

      setTimeout(() => {
        teardown()
        container.innerHTML = ''
        onCount(0)
        onDone()
      }, 650)
    },
  }
}
