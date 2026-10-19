export const CONFETTI_INTENSITIES = ['small', 'medium', 'big'] as const
export type ConfettiIntensity = (typeof CONFETTI_INTENSITIES)[number]

const COUNTS: Record<ConfettiIntensity, number> = {
  big: 320,
  medium: 180,
  small: 90,
}

const GRAVITY = 1100
const DRAG = 2.2
const LIFETIME_MS = 4200

interface Piece {
  color: string
  height: number
  life: number
  rotation: number
  spin: number
  vx: number
  vy: number
  width: number
  wobble: number
  x: number
  y: number
}

const random = (min: number, max: number) => min + Math.random() * (max - min)

const pickColor = (palette: string[]) =>
  palette[Math.floor(Math.random() * palette.length)] ?? '#888'

const cannon = (
  origin: { x: number; y: number },
  angle: number,
  count: number,
  palette: string[]
): Piece[] =>
  Array.from({ length: count }, () => {
    const direction = angle + random(-0.45, 0.45)
    const speed = random(950, 2000)
    return {
      color: pickColor(palette),
      height: random(5, 9),
      life: 0,
      rotation: random(0, Math.PI * 2),
      spin: random(-9, 9),
      vx: Math.cos(direction) * speed,
      vy: Math.sin(direction) * speed,
      width: random(7, 13),
      wobble: random(0, Math.PI * 2),
      x: origin.x,
      y: origin.y,
    }
  })

const rain = (width: number, count: number, palette: string[]): Piece[] =>
  Array.from({ length: count }, () => ({
    color: pickColor(palette),
    height: random(5, 9),
    life: -random(0, 900),
    rotation: random(0, Math.PI * 2),
    spin: random(-7, 7),
    vx: random(-120, 120),
    vy: random(80, 320),
    width: random(7, 13),
    wobble: random(0, Math.PI * 2),
    x: random(0, width),
    y: -20,
  }))

export const launchConfetti = (intensity: ConfettiIntensity) => {
  const styles = getComputedStyle(document.documentElement)
  const palette = [
    '--color-primary',
    '--color-success',
    '--color-destructive',
    '--color-accent-foreground',
    '--color-foreground',
  ]
    .map((token) => styles.getPropertyValue(token).trim())
    .filter(Boolean)
  if (palette.length === 0) {
    return
  }

  const canvas = document.createElement('canvas')
  const dpr = window.devicePixelRatio || 1
  const width = window.innerWidth
  const height = window.innerHeight
  canvas.width = width * dpr
  canvas.height = height * dpr
  canvas.setAttribute('aria-hidden', 'true')
  Object.assign(canvas.style, {
    height: '100dvh',
    inset: '0',
    pointerEvents: 'none',
    position: 'fixed',
    width: '100dvw',
    zIndex: '100',
  })

  const context = canvas.getContext('2d')
  if (!context) {
    return
  }
  context.scale(dpr, dpr)
  document.body.append(canvas)

  const total = COUNTS[intensity]
  const half = Math.round(total / 2)
  const pieces: Piece[] = [
    ...cannon({ x: 0, y: height }, -Math.PI / 3, half, palette),
    ...cannon({ x: width, y: height }, (-2 * Math.PI) / 3, half, palette),
  ]
  if (intensity === 'big') {
    pieces.push(...rain(width, Math.round(total / 2), palette))
  }

  let previous = performance.now()
  const frame = (now: number) => {
    const delta = Math.min((now - previous) / 1000, 0.05)
    previous = now
    context.clearRect(0, 0, width, height)

    let alive = 0
    for (const piece of pieces) {
      piece.life += delta * 1000
      if (piece.life < 0) {
        alive++
        continue
      }
      if (piece.life > LIFETIME_MS || piece.y > height + 40) {
        continue
      }
      alive++

      piece.vx *= Math.exp(-DRAG * delta)
      piece.vy = piece.vy * Math.exp(-DRAG * delta) + GRAVITY * delta
      piece.x += piece.vx * delta
      piece.y += piece.vy * delta
      piece.rotation += piece.spin * delta
      piece.wobble += 8 * delta

      context.save()
      context.globalAlpha = Math.min(1, (LIFETIME_MS - piece.life) / 700)
      context.translate(piece.x, piece.y)
      context.rotate(piece.rotation)
      context.scale(1, Math.cos(piece.wobble))
      context.fillStyle = piece.color
      context.fillRect(
        -piece.width / 2,
        -piece.height / 2,
        piece.width,
        piece.height
      )
      context.restore()
    }

    if (alive > 0) {
      requestAnimationFrame(frame)
    } else {
      canvas.remove()
    }
  }
  requestAnimationFrame(frame)
}
