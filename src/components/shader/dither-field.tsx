'use client'

import { useTheme } from 'next-themes'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

// Square halftone field in two layers: a fine back grid that pans slowly and
// a coarse front grid whose cells grow from domain-warped fbm. Weighted to the
// right so the left stays calm behind text. Pointer drops ripples.
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
uniform float uCell;
uniform vec3 uDeep;
uniform vec3 uMid;
uniform vec3 uHi;
uniform vec2 uPointer;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0; float a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + 11.0; a *= 0.5; }
  return v;
}

// Field value at a point in uv space (height-normalised)
float field(vec2 uv, float t, float aspect) {
  vec2 q = vec2(fbm(uv * 1.2 + vec2(t, 0.0)), fbm(uv * 1.2 + vec2(3.1, 7.7) - t * 0.7));
  float f = fbm(uv * 1.8 + 2.4 * q + vec2(-t * 1.4, 0.0));
  // Weight toward the right, keep the left calm behind text
  float x = uv.x / aspect;
  float bias = smoothstep(0.05, 0.95, x);
  return clamp((f - 0.28) * 1.9, 0.0, 1.0) * (0.35 + 0.65 * bias);
}

float layer(vec2 frag, float cell, float t, float aspect, out float val) {
  vec2 id = floor(frag / cell);
  vec2 local = fract(frag / cell) - 0.5;
  vec2 c = (id + 0.5) * cell;
  vec2 uv = c / uRes.y;
  val = field(uv, t, aspect);
  // Pointer ripple, as in v1
  if (uPointer.x >= 0.0) {
    float d = distance(c / uRes, uPointer) * aspect;
    val += sin(d * 38.0 - uTime * 4.0) * exp(-d * 5.0) * 0.25 + exp(-d * 9.0) * 0.3;
  }
  float half_ = clamp(val * 0.46, 0.0, 0.46);
  vec2 d = abs(local) - half_;
  float aa = 1.0 / cell;
  float sq = 1.0 - smoothstep(-aa, aa, max(d.x, d.y));
  return sq * step(0.06, half_);
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  float aspect = uRes.x / uRes.y;
  float t = uTime * 0.05;

  float v1; float v2;
  float back = layer(frag + vec2(uTime * 2.0, 0.0), uCell * 0.5, t + 4.0, aspect, v2);
  float front = layer(frag, uCell, t, aspect, v1);

  vec3 cFront = mix(uMid, uHi, smoothstep(0.35, 0.95, v1));
  vec3 cBack = mix(uDeep, uMid, v2);
  vec2 uv = frag / uRes.y;
  float wash = field(uv, t, aspect);
  float aBack = back * 0.35;
  float aFront = front * 0.9;
  float aWash = wash * wash * 0.12;
  vec3 col = cBack * aBack;
  col = col * (1.0 - aFront) + cFront * aFront;
  float a = aFront + aBack * (1.0 - aFront);
  col = col + uDeep * aWash * (1.0 - a);
  a = a + aWash * (1.0 - a);
  gl_FragColor = vec4(col, a);
}
`

const CELL_PX = 10
// Cells are 10px, so 1.5x is already crisp and saves ~45% of the fragments
// a 2x screen would shade
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

// Three-stop ramps tuned to --color-fd-primary in each theme
const PALETTES: Record<'dark' | 'light', { deep: Rgb; mid: Rgb; hi: Rgb }> = {
  dark: {
    deep: [0.2, 0.24, 0.62],
    hi: [0.66, 0.69, 1.0],
    mid: [0.4, 0.45, 0.95],
  },
  light: {
    deep: [0.62, 0.68, 0.9],
    hi: [0.2, 0.32, 0.7],
    mid: [0.36, 0.45, 0.82],
  },
}

export function DitherField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()
  const palette = PALETTES[resolvedTheme === 'light' ? 'light' : 'dark']

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
    const uDeep = uniform('uDeep')
    const uMid = uniform('uMid')
    const uHi = uniform('uHi')

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
      gl.uniform1f(
        uTime,
        reducedMotion.matches ? 30 : 30 + (now - start) / 1000
      )
      gl.uniform2f(uPointer, pointer.x, pointer.y)
      gl.uniform1f(uCell, CELL_PX * dpr)
      gl.uniform3f(uDeep, ...palette.deep)
      gl.uniform3f(uMid, ...palette.mid)
      gl.uniform3f(uHi, ...palette.hi)
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
  }, [palette])

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
