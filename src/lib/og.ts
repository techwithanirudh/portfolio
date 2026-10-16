import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { type CoverSwatch, createCover } from '@/lib/cover'
import { PORTRAIT_EYE_FILL, PORTRAIT_EYE_PATHS } from '@/lib/portrait-eyes'

const PORTRAIT_PATH = path.join(process.cwd(), 'public/images/portrait.svg')

const EYES = `<g fill="${PORTRAIT_EYE_FILL}">${PORTRAIT_EYE_PATHS.map((d) => `<path d="${d}"/>`).join('')}</g>`

const loadPortrait = async (): Promise<string | null> => {
  try {
    const svg = await readFile(PORTRAIT_PATH, 'utf8')
    const withEyes = svg.replace('</svg>', `${EYES}</svg>`)
    return `data:image/svg+xml;base64,${Buffer.from(withEyes).toString('base64')}`
  } catch {
    return null
  }
}

let portrait: Promise<string | null> | undefined

export const getPortraitDataUrl = (): Promise<string | null> => {
  portrait ??= loadPortrait()
  return portrait
}

// Each path is spelled out in full so output file tracing picks the file up.

// The subsets' `unicode-range`s, as Google Fonts declares them
const LATIN: [number, number][] = [
  [0x00_00, 0x00_ff],
  [0x01_31, 0x01_31],
  [0x01_52, 0x01_53],
  [0x02_bb, 0x02_bc],
  [0x02_c6, 0x02_c6],
  [0x02_da, 0x02_da],
  [0x02_dc, 0x02_dc],
  [0x03_04, 0x03_04],
  [0x03_08, 0x03_08],
  [0x03_29, 0x03_29],
  [0x20_00, 0x20_6f],
  [0x20_ac, 0x20_ac],
  [0x21_22, 0x21_22],
  [0x21_91, 0x21_91],
  [0x21_93, 0x21_93],
  [0x22_12, 0x22_12],
  [0x22_15, 0x22_15],
  [0xfe_ff, 0xfe_ff],
  [0xff_fd, 0xff_fd],
]
const LATIN_EXT: [number, number][] = [
  [0x01_00, 0x02_ba],
  [0x02_bd, 0x02_c5],
  [0x02_c7, 0x02_cc],
  [0x02_ce, 0x02_d7],
  [0x02_dd, 0x02_ff],
  [0x03_04, 0x03_04],
  [0x03_08, 0x03_08],
  [0x03_29, 0x03_29],
  [0x1d_00, 0x1d_bf],
  [0x1e_00, 0x1e_9f],
  [0x1e_f2, 0x1e_ff],
  [0x20_20, 0x20_20],
  [0x20_a0, 0x20_ab],
  [0x20_ad, 0x20_c0],
  [0x21_13, 0x21_13],
  [0x2c_60, 0x2c_7f],
  [0xa7_20, 0xa7_ff],
]

const FONT_FILES = [
  {
    file: path.join(process.cwd(), 'src/app/og/_fonts/geist-latin.woff2'),
    name: 'Geist',
    unicodeRange: LATIN,
  },
  {
    file: path.join(process.cwd(), 'src/app/og/_fonts/geist-latin-ext.woff2'),
    name: 'Geist',
    unicodeRange: LATIN_EXT,
  },
]

export interface OgFont {
  data: Buffer
  name: string
  unicodeRange: [number, number][]
}

const loadFonts = async (): Promise<OgFont[]> => {
  const fonts = await Promise.all(
    FONT_FILES.map(async ({ file, ...font }) => {
      try {
        return { ...font, data: await readFile(file) }
      } catch {
        return null
      }
    })
  )
  return fonts.filter((font) => font !== null)
}

let fonts: Promise<OgFont[]> | undefined

export const getOgFonts = (): Promise<OgFont[]> => {
  fonts ??= loadFonts()
  return fonts
}

const SWATCH_HEX: Record<CoverSwatch, string> = {
  azure: '#60a5fa',
  blue: '#93c5fd',
  cyan: '#38bdf8',
  lavender: '#c4b5fd',
  sky: '#7dd3fc',
  violet: '#a78bfa',
}

const BLOB_SPREAD_FACTOR = 1.1
const BLOB_RADIUS_FACTOR = 0.9

export const getCoverDataUrl = (
  seed: string,
  { height, width }: { height: number; width: number }
): string => {
  const cover = createCover(seed)
  const gradients = cover.blobs
    .map(
      ({ swatch }, i) =>
        `<radialGradient id="g${i}"><stop offset="0" stop-color="${SWATCH_HEX[swatch]}"/><stop offset=".45" stop-color="${SWATCH_HEX[swatch]}" stop-opacity=".75"/><stop offset="1" stop-color="${SWATCH_HEX[swatch]}" stop-opacity="0"/></radialGradient>`
    )
    .join('')
  const blobs = cover.blobs
    .map(({ rotate, ...blob }, i) => {
      const cx = 50 + (blob.cx - 50) * BLOB_SPREAD_FACTOR
      const cy = 50 + (blob.cy - 50) * BLOB_SPREAD_FACTOR
      return `<ellipse cx="${cx}" cy="${cy}" rx="${blob.rx * BLOB_RADIUS_FACTOR}" ry="${blob.ry * BLOB_RADIUS_FACTOR}" fill="url(#g${i})" transform="rotate(${rotate} ${cx} ${cy})"/>`
    })
    .join('')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><defs>${gradients}<radialGradient id="wash" cx="0.2" cy="0.85" r="0.75"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset=".55" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient><filter id="grain" x="0" y="0" width="${width}" height="${height}" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="1" seed="${cover.seed % 1000}"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2.6 0 0 0 -0.8"/><feComposite in="SourceAlpha" operator="arithmetic" k2="1" k3="-1" k4="0.5"/><feComponentTransfer result="mask"><feFuncA type="linear" slope="3" intercept="-1"/></feComponentTransfer><feComponentTransfer in="SourceGraphic"><feFuncA type="linear" slope="24"/></feComponentTransfer><feComposite in2="mask" operator="in"/></filter></defs><rect width="${width}" height="${height}" fill="#fff"/><g filter="url(#grain)"><g transform="scale(${width / 100} ${height / 100})">${blobs}</g></g><rect width="${width}" height="${height}" fill="url(#wash)"/></svg>`
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}
