import type { CSSProperties } from 'react'

export const colors = {
  background: '#f5f5f5',
  border: '#e0e0e0',
  card: '#fafafa',
  foreground: '#0a0a0a',
  muted: '#636363',
  primary: '#3451b2',
  primaryForeground: '#fafafa',
} as const

export const darkColors = {
  background: '#121212',
  border: '#232323',
  card: '#191919',
  foreground: '#ebebeb',
  muted: '#929292',
  primary: '#a8b1ff',
} as const

export const fonts = {
  hand: "Caveat, 'Comic Sans MS', cursive",
  sans: 'Geist, -apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif',
} as const

export const webFonts = {
  caveat:
    'https://fonts.gstatic.com/s/caveat/v23/Wnz6HAc5bAfYB2Q7ZjYYiAzcPA.woff2',
  geist: 'https://fonts.gstatic.com/s/geist/v5/gyByhwUxId8gMEwcGFWNOITd.woff2',
} as const

export const radius = {
  button: '6px',
  card: '8px',
} as const

export const contentWidth = 536

const dashed = `1px dashed ${colors.border}`

export const styles = {
  body: {
    backgroundColor: colors.background,
    color: colors.foreground,
    fontFamily: fonts.sans,
    margin: 0,
    padding: '32px 0',
  },
  button: {
    backgroundColor: colors.primary,
    backgroundImage:
      'linear-gradient(to bottom, rgba(255,255,255,0.12), rgba(255,255,255,0))',
    border: `1px solid ${colors.primary}`,
    borderRadius: radius.button,
    boxShadow:
      'inset 0 1px 0 rgba(255,255,255,0.07), 0 1px 3px rgba(17,24,39,0.2)',
    color: colors.primaryForeground,
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '20px',
    padding: '9px 12px 9px 16px',
    textDecoration: 'none',
  },
  buttonIcon: {
    display: 'inline-block',
    marginLeft: '8px',
    verticalAlign: '-3px',
  },
  card: {
    backgroundColor: colors.card,
    border: `1px solid ${colors.border}`,
    borderRadius: radius.card,
    padding: '16px 20px',
  },
  frame: {
    borderLeft: dashed,
    borderRight: dashed,
    maxWidth: '600px',
  },
  heading: {
    color: colors.foreground,
    fontSize: '36px',
    fontWeight: 400,
    letterSpacing: '-1.6px',
    lineHeight: '40px',
    margin: 0,
  },
  label: {
    color: colors.muted,
    fontSize: '13px',
    lineHeight: '20px',
    margin: 0,
    textAlign: 'right',
  },
  link: {
    color: colors.primary,
    textDecoration: 'none',
  },
  muted: {
    color: colors.muted,
    fontSize: '14px',
    lineHeight: '22px',
    margin: 0,
  },
  section: {
    padding: '28px 32px',
  },
  sectionDivided: {
    borderTop: dashed,
    padding: '28px 32px',
  },
  text: {
    color: colors.foreground,
    fontSize: '16px',
    lineHeight: '26px',
    margin: '0 0 16px',
  },
  wordmark: {
    color: colors.foreground,
    fontSize: '18px',
    fontWeight: 600,
    letterSpacing: '-0.5px',
    lineHeight: '24px',
    textDecoration: 'none',
  },
} satisfies Record<string, CSSProperties>

/** react-email's Font sets `* { font-family }`, so Caveat is declared here and applied inline */
export const headCss = `
@font-face {
  font-family: 'Caveat';
  font-style: normal;
  font-weight: 400 700;
  src: url(${webFonts.caveat}) format('woff2');
}
:root { color-scheme: light dark; supported-color-schemes: light dark; }
@media (prefers-color-scheme: dark) {
  /* Inline styles win over a stylesheet, hence !important; Body puts its background on an inner td */
  .em-body, .em-body > table > tbody > tr > td { background-color: ${darkColors.background} !important; }
  .em-frame, .em-divided { border-color: ${darkColors.border} !important; }
  .em-fg { color: ${darkColors.foreground} !important; }
  .em-muted { color: ${darkColors.muted} !important; }
  .em-link { color: ${darkColors.primary} !important; }
  .em-card { background-color: ${darkColors.card} !important; border-color: ${darkColors.border} !important; }
  .em-button { background-color: ${darkColors.primary} !important; background-image: none !important; border-color: ${darkColors.primary} !important; color: ${darkColors.background} !important; }
  .em-arrow { filter: invert(1); }
}
`
