import Link from 'next/link'

const variants = [
  {
    base: 'chanhdai.com (MIT)',
    name: 'Drawing Set',
    pitch:
      'The current ruled style taken all the way: every page is a sheet of an engineering drawing, the career is the revision table, projects are a bill of materials.',
    slug: 'drawing-set',
  },
  {
    base: 'victoreke.com and jahir.dev (MIT), Braydon Coyer ideas rebuilt',
    name: 'Field Notes',
    pitch:
      'A warm, personal notebook: serif type, ballpoint blue, taped photos, handwritten margin notes and a journey told in chapters.',
    slug: 'field-notes',
  },
  {
    base: 'nelsonlai.dev (MIT)',
    name: 'Status',
    pitch:
      'A status page for a person: live tiles, uptime bars for every year and project, dark and dense.',
    slug: 'status',
  },
  {
    base: 'original, built for the QuiverAI and SVG angle',
    name: 'Artboard',
    pitch:
      'The site as a design file: rulers, artboards, selection handles, a layers panel and a journey drawn with the pen tool.',
    slug: 'artboard',
  },
]

export default function VariantsIndex() {
  return (
    <main className='mx-auto max-w-2xl px-6 py-20'>
      <p className='font-mono text-muted-foreground text-xs uppercase tracking-widest'>
        Prototypes
      </p>
      <h1 className='mt-2 font-semibold text-3xl tracking-tight'>
        Four directions for the remake
      </h1>
      <p className='mt-3 text-muted-foreground'>
        Each one has Home, About and Work built on the real content. Nothing
        here touches the live site.
      </p>
      <ul className='mt-10 divide-y divide-dashed divide-border border-border border-y border-dashed'>
        {variants.map((v, i) => (
          <li key={v.slug}>
            <Link
              className='group grid grid-cols-[2.5rem_1fr] gap-x-4 py-6'
              href={`/variants/${v.slug}`}
            >
              <span className='font-mono text-muted-foreground text-sm tabular-nums'>
                0{i + 1}
              </span>
              <span>
                <span className='font-medium text-lg group-hover:underline'>
                  {v.name}
                </span>
                <span className='mt-1 block text-muted-foreground'>
                  {v.pitch}
                </span>
                <span className='mt-2 block font-mono text-muted-foreground text-xs'>
                  Base: {v.base}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
