import type { ReactElement, ReactNode } from 'react'
import { owner } from '@/constants/site'

export const ogImageSize = { height: 630, width: 1200 }

// Light-theme tokens from globals.css, written out because the renderer has
// no access to CSS variables
const colors = {
  border: '#d9d9d9',
  cross: '#a3a3a3',
  foreground: '#0a0a0a',
  // muted-foreground, a step darker so it holds up on the white card
  muted: '#4d4d4d',
  page: '#f4f4f4',
  primary: 'hsl(226, 55%, 45%)',
}

// Geist comes from getOgFonts; the renderer's bundled Geist Sans covers
// anything it doesn't
const fontFamily = "Geist, 'Geist Sans'"

// The dashed rails. The card fills the box between them.
const rail = { bottom: 566, left: 64, right: 1136, top: 64 }

/** The card's size, for drawing its cover to fit. */
export const ogCoverSize = {
  height: rail.bottom - rail.top,
  width: rail.right - rail.left,
}

const dateFormat = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'short',
  // Frontmatter dates are bare days, parsed as UTC midnight
  timeZone: 'UTC',
  year: 'numeric',
})

function Cross({ x, y }: { x: number; y: number }): ReactElement {
  return (
    <div
      style={{
        display: 'flex',
        height: 17,
        left: x - 8,
        position: 'absolute',
        top: y - 8,
        width: 17,
      }}
    >
      <div
        style={{
          backgroundColor: colors.cross,
          height: 1,
          left: 0,
          position: 'absolute',
          top: 8,
          width: 17,
        }}
      />
      <div
        style={{
          backgroundColor: colors.cross,
          height: 17,
          left: 8,
          position: 'absolute',
          top: 0,
          width: 1,
        }}
      />
    </div>
  )
}

function Rails(): ReactElement {
  const dashed = `1px dashed ${colors.border}`
  return (
    <>
      {[rail.left, rail.right].map((x) => (
        <div
          key={`v${x}`}
          style={{
            borderLeft: dashed,
            bottom: 0,
            left: x,
            position: 'absolute',
            top: 0,
          }}
        />
      ))}
      {[rail.top, rail.bottom].map((y) => (
        <div
          key={`h${y}`}
          style={{
            borderTop: dashed,
            left: 0,
            position: 'absolute',
            right: 0,
            top: y,
          }}
        />
      ))}
      {[rail.left, rail.right].flatMap((x) =>
        [rail.top, rail.bottom].map((y) => (
          <Cross key={`${x},${y}`} x={x} y={y} />
        ))
      )}
    </>
  )
}

function PortraitTile({
  radius,
  size,
  src,
}: {
  radius: number
  size: number
  src: string
}): ReactElement {
  return (
    <div
      style={{
        // The portrait over the hero tile's gradient, as one background
        backgroundImage: `url(${src}), linear-gradient(160deg, #c3b6fa, #9fccfa 55%, #7fd0f5)`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        borderRadius: radius,
        display: 'flex',
        flexShrink: 0,
        height: size,
        width: size,
      }}
    />
  )
}

interface OgFrameProps {
  /** Content, stacked on the bottom of the card. */
  children: ReactNode
  /** The card's generated cover, from getCoverDataUrl. */
  coverSrc: string
  /** Space between the stacked content. */
  gap: number
}

/**
 * The page as the site draws it, light grey with dashed rails and `+` marks
 * where they cross, holding a white card under a generated grain cover like
 * the blog's, with the content on its bottom edge.
 */
function OgFrame({ children, coverSrc, gap }: OgFrameProps): ReactElement {
  return (
    <div
      style={{
        backgroundColor: colors.page,
        color: colors.foreground,
        display: 'flex',
        fontFamily,
        height: '100%',
        position: 'relative',
        width: '100%',
      }}
    >
      <Rails />

      <div
        style={{
          backgroundColor: '#ffffff',
          backgroundImage: `url(${coverSrc})`,
          backgroundSize: '100% 100%',
          border: `1px solid ${colors.border}`,
          borderRadius: 14,
          display: 'flex',
          flexDirection: 'column',
          gap,
          justifyContent: 'flex-end',
          left: rail.left,
          overflow: 'hidden',
          padding: 56,
          position: 'absolute',
          top: rail.top,
          ...ogCoverSize,
        }}
      >
        {children}
      </div>
    </div>
  )
}

const closingMarks = new Set(['.', '!', '?', '…'])

interface TitleProps {
  maxWidth?: number
  size: number
  title: string
}

/**
 * The title as the hero sets the name: medium weight, tight tracking and a
 * blue full stop. A title that already ends in a stop, `?`, `!` or `…` keeps
 * its own mark, in blue.
 */
function Title({ maxWidth, size, title }: TitleProps): ReactElement {
  const text = title.trimEnd()
  const last = text.at(-1) ?? ''
  const [body, mark] = closingMarks.has(last)
    ? [text.slice(0, -1), last]
    : [text, '.']

  return (
    <div
      style={{
        display: 'block',
        fontSize: size,
        fontWeight: 500,
        letterSpacing: '-0.045em',
        lineClamp: 4,
        lineHeight: 1.02,
        maxWidth,
        // Balancing narrows the lines, which long titles can't spare
        textWrap: size >= 68 ? 'balance' : 'pretty',
      }}
    >
      {body}
      <span style={{ color: colors.primary }}>{mark}</span>
    </div>
  )
}

function Description({ children }: { children: string }): ReactElement {
  return (
    <div
      style={{
        color: colors.muted,
        display: 'block',
        fontSize: 30,
        letterSpacing: '-0.01em',
        lineClamp: 2,
        lineHeight: 1.4,
        maxWidth: 940,
        textOverflow: 'ellipsis',
        textWrap: 'pretty',
      }}
    >
      {children}
    </div>
  )
}

// Each step keeps four lines of title inside the card, above two lines of
// description (pages) or the byline (posts)
const pageTitleSizes = [
  [20, 96],
  [40, 72],
  [80, 56],
  [120, 48],
] as const
const postTitleSizes = [
  [40, 72],
  [70, 64],
  [110, 54],
  [140, 48],
] as const

function getTitleSize(
  title: string,
  steps: typeof pageTitleSizes | typeof postTitleSizes,
  smallest: number
): number {
  return steps.find(([chars]) => title.length <= chars)?.[1] ?? smallest
}

interface PageImageProps {
  coverSrc: string
  description?: string
  title: string
}

/** OG card for a page: title and one or two lines of description. */
export function PageImage({
  coverSrc,
  description,
  title,
}: PageImageProps): ReactElement {
  const size = getTitleSize(title, pageTitleSizes, 44)
  return (
    <OgFrame coverSrc={coverSrc} gap={18}>
      <Title
        maxWidth={size >= 72 ? 860 : undefined}
        size={size}
        title={title}
      />
      {description && <Description>{description}</Description>}
    </OgFrame>
  )
}

interface PostImageProps {
  coverSrc: string
  date?: Date
  portraitSrc: string | null
  title: string
}

/** OG card for a blog post or a project: title, byline and date. */
export function PostImage({
  coverSrc,
  date,
  portraitSrc,
  title,
}: PostImageProps): ReactElement {
  const size = getTitleSize(title, postTitleSizes, 44)
  return (
    <OgFrame coverSrc={coverSrc} gap={28}>
      <Title
        maxWidth={size >= 64 ? 860 : undefined}
        size={size}
        title={title}
      />
      <div style={{ alignItems: 'center', display: 'flex', gap: 14 }}>
        {portraitSrc && (
          <PortraitTile radius={11} size={40} src={portraitSrc} />
        )}
        <span
          style={{
            fontSize: 26,
            fontWeight: 500,
            letterSpacing: '-0.02em',
          }}
        >
          {owner}
        </span>
        {date && (
          <span style={{ color: colors.muted, fontSize: 26 }}>
            {`· ${dateFormat.format(date)}`}
          </span>
        )}
      </div>
    </OgFrame>
  )
}

interface BannerImageProps {
  coverSrc: string
  description: string
  portraitSrc: string | null
  title: string
}

/** The site-wide card: the hero's portrait, name and blue full stop. */
export function BannerImage({
  coverSrc,
  description,
  portraitSrc,
  title,
}: BannerImageProps): ReactElement {
  return (
    <OgFrame coverSrc={coverSrc} gap={18}>
      {portraitSrc && (
        <div style={{ display: 'flex', marginBottom: 6 }}>
          <PortraitTile radius={19} size={72} src={portraitSrc} />
        </div>
      )}
      <Title size={96} title={title} />
      <Description>{description}</Description>
    </OgFrame>
  )
}
