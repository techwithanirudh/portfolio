'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

// Halftone field in the primary blue. The shader paints one dot per cell and
// sizes it from a domain-warped noise field, so it reads as a grid of dots
// that breathe. The pointer drops ripples into the field.
const VERTEX = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`

const FRAGMENT = `
precision highp float;

uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPointer;
uniform float uCell;
uniform vec3 uColor;
uniform float uDark;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = p * 2.02 + 17.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 cellId = floor(frag / uCell);
  vec2 local = fract(frag / uCell) - 0.5;
  vec2 center = (cellId + 0.5) * uCell;

  // Aspect-correct coordinates, anchored to the cell center
  vec2 uv = center / uRes.y;
  float t = uTime * 0.12;

  vec2 q = vec2(fbm(uv * 2.2 + t), fbm(uv * 2.2 + vec2(5.2, 1.3) - t));
  float field = fbm(uv * 2.6 + 2.2 * q + vec2(t * 0.6, 0.0));

  // Sweep of light from the right edge so the left stays calm behind text
  float sweep = smoothstep(0.0, 1.0, center.x / uRes.x);
  field = field * (0.35 + 0.9 * sweep);

  // Pointer ripple
  if (uPointer.x >= 0.0) {
    float d = distance(center / uRes, uPointer) * (uRes.x / uRes.y);
    float ring = sin(d * 38.0 - uTime * 4.0) * exp(-d * 5.0);
    field += ring * 0.28;
    field += exp(-d * 9.0) * 0.35;
  }

  // Fade out toward the bottom so the banner melts into the page
  float fade = smoothstep(0.0, 0.85, center.y / uRes.y);
  field *= fade;

  float radius = clamp(field * 1.15 - 0.12, 0.0, 0.5);
  float dist = length(local);
  float aa = 1.5 / uCell;
  float dotMask = 1.0 - smoothstep(radius - aa, radius + aa, dist);

  float alpha = dotMask * mix(0.9, 1.0, uDark) * smoothstep(0.02, 0.25, radius);
  gl_FragColor = vec4(uColor * alpha, alpha);
}
`

const CELL_PX = 9
const MAX_DPR = 2

type Rgb = [number, number, number]

const compile = (
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null => {
  const shader = gl.createShader(type)
  if (!shader) {
    return null
  }
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

const createProgram = (gl: WebGLRenderingContext): WebGLProgram | null => {
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX)
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT)
  const program = gl.createProgram()
  if (!(vertex && fragment && program)) {
    return null
  }
  gl.attachShader(program, vertex)
  gl.attachShader(program, fragment)
  gl.linkProgram(program)
  return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : null
}

// The theme color is an hsl() custom property, so let the browser resolve it
// and read the pixel back instead of parsing color strings by hand.
const readPrimary = (el: HTMLElement): Rgb => {
  const probe = document.createElement('canvas')
  probe.width = 1
  probe.height = 1
  const ctx = probe.getContext('2d', { willReadFrequently: true })
  if (!ctx) {
    return [0.2, 0.34, 0.7]
  }
  ctx.fillStyle = getComputedStyle(el).getPropertyValue('--color-fd-primary')
  ctx.fillRect(0, 0, 1, 1)
  const [r = 52, g = 86, b = 178] = ctx.getImageData(0, 0, 1, 1).data
  return [r / 255, g / 255, b / 255]
}

export function DitherField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const host = canvas?.parentElement
    if (!(canvas && host)) {
      return
    }

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
    })
    const program = gl && createProgram(gl)
    if (!(gl && program)) {
      return
    }

    // Aliased because Biome mistakes WebGL's useProgram for a React hook
    const bindProgram = gl.useProgram.bind(gl)
    bindProgram(program)
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    )
    const aPos = gl.getAttribLocation(program, 'aPos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uniform = (name: string) => gl.getUniformLocation(program, name)
    const uRes = uniform('uRes')
    const uTime = uniform('uTime')
    const uPointer = uniform('uPointer')
    const uCell = uniform('uCell')
    const uColor = uniform('uColor')
    const uDark = uniform('uDark')

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pointer = { x: -1, y: -1 }
    let color = readPrimary(host)
    let dark = document.documentElement.classList.contains('dark') ? 1 : 0
    let visible = true
    let frame = 0
    const start = performance.now()
    let dpr = 1

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      const { width, height } = host.getBoundingClientRect()
      canvas.width = Math.max(1, Math.round(width * dpr))
      canvas.height = Math.max(1, Math.round(height * dpr))
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    const draw = (now: number) => {
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.uniform2f(uRes, canvas.width, canvas.height)
      // A still frame for reduced motion still needs a pleasing time offset
      gl.uniform1f(uTime, reducedMotion.matches ? 24 : (now - start) / 1000)
      gl.uniform2f(uPointer, pointer.x, pointer.y)
      gl.uniform1f(uCell, CELL_PX * dpr)
      gl.uniform3f(uColor, color[0], color[1], color[2])
      gl.uniform1f(uDark, dark)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    const loop = (now: number) => {
      draw(now)
      frame =
        visible && !reducedMotion.matches ? requestAnimationFrame(loop) : 0
    }

    const kick = () => {
      if (frame === 0) {
        frame = requestAnimationFrame(loop)
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width
      const y = 1 - (event.clientY - rect.top) / rect.height
      const inside = x >= 0 && x <= 1 && y >= 0 && y <= 1
      pointer.x = inside ? x : -1
      pointer.y = inside ? y : -1
      if (reducedMotion.matches) {
        draw(performance.now())
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      resize()
      draw(performance.now())
    })
    resizeObserver.observe(host)

    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true
      if (visible) {
        kick()
      }
    })
    intersection.observe(host)

    const themeObserver = new MutationObserver(() => {
      dark = document.documentElement.classList.contains('dark') ? 1 : 0
      color = readPrimary(host)
      draw(performance.now())
    })
    themeObserver.observe(document.documentElement, {
      attributeFilter: ['class'],
      attributes: true,
    })

    const onMotionChange = () => {
      kick()
      draw(performance.now())
    }
    reducedMotion.addEventListener('change', onMotionChange)
    window.addEventListener('pointermove', onPointerMove, { passive: true })

    resize()
    kick()

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      intersection.disconnect()
      themeObserver.disconnect()
      reducedMotion.removeEventListener('change', onMotionChange)
      window.removeEventListener('pointermove', onPointerMove)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
    }
  }, [])

  return (
    <canvas
      aria-hidden
      className={cn('pointer-events-none size-full', className)}
      ref={canvasRef}
    />
  )
}
