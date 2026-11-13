/**
 * Plain-language definitions for the jargon on project and blog pages, read by
 * the <Term> MDX component. Keys are lowercase with dashes for spaces, so
 * `<Term>Delaunay triangulation</Term>` finds `delaunay-triangulation` on its own.
 */
export interface GlossaryEntry {
  /** One casual sentence a non-developer can follow */
  definition: string
  /** What the letters stand for, when it's an acronym */
  expansion?: string
  /** Part of speech, such as "noun" */
  kind?: string
  /** How to say it, when it isn't obvious */
  pronunciation?: string
  /** The word as it should read in the card's heading */
  term: string
}

export const glossary = {
  daemon: {
    definition:
      'A program that runs quietly in the background and does its job without a window of its own.',
    kind: 'noun',
    pronunciation: 'dee-mun',
    term: 'daemon',
  },
  'delaunay-triangulation': {
    definition:
      'A way to join a set of points into triangles that keeps them as even as possible and avoids long, skinny ones.',
    kind: 'noun',
    pronunciation: 'deh-loh-nay',
    term: 'Delaunay triangulation',
  },
  'hdmi-cec': {
    definition:
      'A part of HDMI that lets devices on the same cable send each other control signals, like the buttons you press on a TV remote.',
    expansion: 'Consumer Electronics Control',
    kind: 'noun',
    term: 'HDMI-CEC',
  },
  mcp: {
    definition:
      'An open standard for plugging tools and data into AI apps, so a model can use them the same way everywhere.',
    expansion: 'Model Context Protocol',
    kind: 'noun',
    term: 'MCP',
  },
  monorepo: {
    definition:
      'One repository that holds several related projects, like an app and its API, so they can share code and change together.',
    kind: 'noun',
    term: 'monorepo',
  },
  pglite: {
    definition:
      'A build of the Postgres database compiled to WebAssembly, so a real Postgres can run inside a browser tab.',
    kind: 'noun',
    term: 'PGLite',
  },
  pty: {
    definition:
      'A stand-in terminal that one program drives for another, so tools that expect a person typing at a keyboard still work.',
    expansion: 'pseudo-terminal',
    kind: 'noun',
    term: 'PTY',
  },
  rag: {
    definition:
      'Looking up the relevant bits of your own documents and handing them to an AI model with your question, so it answers from them.',
    expansion: 'retrieval-augmented generation',
    kind: 'noun',
    term: 'RAG',
  },
} satisfies Record<string, GlossaryEntry>

export type GlossaryId = keyof typeof glossary

const WHITESPACE = /\s+/g

/** Turns a word like "Delaunay triangulation" into its glossary key */
export const toGlossaryId = (word: string) =>
  word.trim().toLowerCase().replace(WHITESPACE, '-')

export const getGlossaryEntry = (id: string): GlossaryEntry | undefined =>
  (glossary as Record<string, GlossaryEntry>)[id]
