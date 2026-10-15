'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

// Halftone field in the old hero's violet-to-azure glow. One dot per cell,
// sized from a warped blob plus noise, so it reads as a gradient made of dots
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
uniform vec3 uViolet;
uniform vec3 uAzure;

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

  float aspect = uRes.x / uRes.y;
  vec2 st = center / uRes;
  vec2 uv = center / uRes.y;
  float t = uTime * 0.12;

  // The old hero's violet-to-azure glow: a warped blob sitting low on the
  // right, so the left stays calm behind text
  vec2 warp = vec2(fbm(uv * 1.6 + t), fbm(uv * 1.6 + vec2(5.2, 1.3) - t)) - 0.5;
  vec2 blobCenter = vec2(0.82 + 0.05 * sin(uTime * 0.21), 0.2 + 0.08 * cos(uTime * 0.17));
  vec2 offset = (st - blobCenter) * vec2(aspect * 0.42, 1.0) + warp * 0.55;
  float dist = length(offset);
  float glow = 1.0 - smoothstep(0.0, 0.62, dist);

  // Azure in the core, violet toward the rim, nudged by noise so it shifts
  float core = 1.0 - smoothstep(0.0, 0.38, dist + (fbm(uv * 3.0 - t) - 0.5) * 0.25);
  vec3 color = mix(uViolet, uAzure, core);

  float field = glow * (0.75 + 0.5 * fbm(uv * 2.6 + 2.2 * warp + vec2(t * 0.6, 0.0)));

  // Pointer ripple
  if (uPointer.x >= 0.0) {
    float d = distance(st, uPointer) * aspect;
    float ring = sin(d * 38.0 - uTime * 4.0) * exp(-d * 5.0);
    field += ring * 0.28;
    field += exp(-d * 9.0) * 0.35;
  }

  float radius = clamp(field * 0.62 - 0.04, 0.0, 0.5);
  float aa = 1.5 / uCell;
  float dotMask = 1.0 - smoothstep(radius - aa, radius + aa, length(local));
  float dots = dotMask * smoothstep(0.02, 0.2, radius);

  // A faint wash of the gradient under the dots keeps it reading as a glow
  float wash = glow * glow * 0.14;
  float alpha = max(dots * 0.85, wash);
  gl_FragColor = vec4(color * alpha, alpha);
}
`

const CELL_PX = 9
// The dots are 9px cells, so 1.5x is already crisp and saves ~45% of the
// fragments a 2x screen would shade
const MAX_DPR = 1.5
// A slow drift doesn't need 60fps; 30 halves the GPU and main-thread cost
const FRAME_MS = 1000 / 30

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

// Sampled from the old hero's gradient-noise-purple-azure image. One deeper
// palette for both themes; the brighter dark-mode one read as washed out.
const PALETTE: { violet: Rgb; azure: Rgb } = {
  azure: [0.22, 0.66, 0.9],
  violet: [0.5, 0.36, 0.88],
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
    const uViolet = uniform('uViolet')
    const uAzure = uniform('uAzure')

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pointer = { x: -1, y: -1 }
    let visible = true
    let frame = 0
    let lastDraw = 0
    const start = performance.now()
    let dpr = 1
    let revealed = false

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
      gl.uniform3f(uViolet, ...PALETTE.violet)
      gl.uniform3f(uAzure, ...PALETTE.azure)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      if (!revealed) {
        revealed = true
        // Some browsers composite a fresh WebGL canvas as white until its first
        // frame is on screen, so reveal it two frames after the first draw
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            canvas.dataset.ready = ''
          })
        )
      }
    }

    const loop = (now: number) => {
      // A little slack so rAF jitter on 60Hz screens doesn't drop us to 20fps
      if (now - lastDraw >= FRAME_MS - 4) {
        lastDraw = now
        draw(now)
      }
      frame =
        visible && !document.hidden && !reducedMotion.matches
          ? requestAnimationFrame(loop)
          : 0
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

    const onMotionChange = () => {
      kick()
      draw(performance.now())
    }
    const onVisibilityChange = () => {
      if (!document.hidden) {
        kick()
      }
    }
    reducedMotion.addEventListener('change', onMotionChange)
    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('pointermove', onPointerMove, { passive: true })

    resize()
    kick()

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      intersection.disconnect()
      reducedMotion.removeEventListener('change', onMotionChange)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('pointermove', onPointerMove)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
    }
  }, [])

  return (
    <canvas
      aria-hidden
      className={cn(
        'pointer-events-none size-full opacity-0 transition-opacity duration-700 data-ready:opacity-100',
        className
      )}
      ref={canvasRef}
    />
  )
}
