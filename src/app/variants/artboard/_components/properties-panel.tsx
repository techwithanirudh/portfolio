'use client'

import { ArrowUpRight, Eye, MousePointerClick } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { type ReactNode, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { CodePreview } from './code-preview'
import { cssToHex, tagSwatch } from './color'
import { layerIcons } from './layers-panel'
import type { SelectionInfo } from './selection'
import { StackFilter } from './stack-filter'
import { type Selection, useWorkspace } from './workspace'

interface Geometry {
  h: number
  w: number
  x: number
  y: number
}

/** X and Y relative to the layer's artboard, like a design tool reports them. */
function useGeometry(el: HTMLElement | undefined) {
  const [geo, setGeo] = useState<Geometry | null>(null)

  useEffect(() => {
    if (!el) {
      setGeo(null)
      return
    }
    const measure = () => {
      const r = el.getBoundingClientRect()
      const frame = el.parentElement?.closest<HTMLElement>('[data-frame]')
      const f = frame?.getBoundingClientRect()
      setGeo({
        h: Math.round(r.height),
        w: Math.round(r.width),
        x: Math.round(f ? r.left - f.left : 0),
        y: Math.round(f ? r.top - f.top : 0),
      })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [el])

  return geo
}

interface Type {
  family: string
  letterSpacing: string
  lineHeight: string
  size: string
  weight: string
}

const weightName: Record<string, string> = {
  '400': 'Regular',
  '500': 'Medium',
  '600': 'Semibold',
  '700': 'Bold',
}

/** Live typography of a text layer, read from its computed style. */
function useTypography(el: HTMLElement | undefined, enabled: boolean) {
  const { resolvedTheme } = useTheme()
  const [type, setType] = useState<(Type & { color: string | null }) | null>(
    null
  )

  // Re-read when the theme flips: the text colour changes with it.
  // biome-ignore lint/correctness/useExhaustiveDependencies: resolvedTheme is the trigger
  useEffect(() => {
    if (!(el && enabled)) {
      setType(null)
      return
    }
    const s = getComputedStyle(el)
    const family = (s.fontFamily.split(',')[0] ?? '').replaceAll('"', '').trim()
    const size = Number.parseFloat(s.fontSize)
    const lh = Number.parseFloat(s.lineHeight)
    const ls = Number.parseFloat(s.letterSpacing)
    setType({
      color: cssToHex(s.color),
      family: family.replace(/^__|_[a-f0-9]+$/gi, '').replace(/_/g, ' '),
      letterSpacing: Number.isNaN(ls)
        ? '0%'
        : `${Math.round((ls / size) * 1000) / 10}%`,
      lineHeight: Number.isNaN(lh) ? 'Auto' : `${Math.round(lh)}`,
      size: `${Math.round(size)}`,
      weight: weightName[s.fontWeight] ?? s.fontWeight,
    })
  }, [el, enabled, resolvedTheme])

  return type
}

function Section({
  action,
  children,
  title,
}: {
  action?: ReactNode
  children: ReactNode
  title: string
}) {
  return (
    <section className='ab-panel-section'>
      <h3 className='ab-panel-title'>
        {title}
        {action}
      </h3>
      {children}
    </section>
  )
}

function Field({
  className,
  label,
  value,
}: {
  className?: string
  label: string
  value: ReactNode
}) {
  return (
    <div className={cn('ab-field', className)}>
      <span className='ab-field-key'>{label}</span>
      <span className='ab-mono min-w-0 truncate'>{value}</span>
    </div>
  )
}

function LayoutSection({ el }: { el: HTMLElement }) {
  const geo = useGeometry(el)
  return (
    <Section title='Layout'>
      <div className='grid grid-cols-2 gap-1.5'>
        <Field label='X' value={geo?.x ?? '–'} />
        <Field label='Y' value={geo?.y ?? '–'} />
        <Field label='W' value={geo?.w ?? '–'} />
        <Field label='H' value={geo?.h ?? '–'} />
      </div>
    </Section>
  )
}

function TypographySection({ el }: { el: HTMLElement }) {
  const type = useTypography(el, true)
  if (!type) {
    return null
  }
  return (
    <Section title='Typography'>
      <div className='grid gap-1.5'>
        <Field label='Font' value={type.family} />
        <div className='grid grid-cols-2 gap-1.5'>
          <Field label='Wt' value={type.weight} />
          <Field label='Size' value={type.size} />
          <Field label='LH' value={type.lineHeight} />
          <Field label='LS' value={type.letterSpacing} />
        </div>
        {type.color ? (
          <div className='ab-field'>
            <span
              aria-hidden
              className='size-3.5 rounded-[3px] shadow-[inset_0_0_0_1px_rgb(0_0_0/0.12)]'
              style={{ background: type.color }}
            />
            <span className='ab-mono'>{type.color}</span>
            <span className='ab-mono ml-auto text-(--faint)'>100%</span>
          </div>
        ) : null}
      </div>
    </Section>
  )
}

function InfoSections({ info }: { info: SelectionInfo }) {
  return (
    <>
      {info.fields.length > 0 ? (
        <Section title='Content'>
          <dl className='grid grid-cols-[64px_1fr] gap-x-2 gap-y-1.5 text-[11px] leading-4'>
            {info.fields.map((field) => (
              <div className='contents' key={field.label}>
                <dt className='ab-mono pt-px text-(--faint)'>{field.label}</dt>
                <dd className={cn('min-w-0', field.mono && 'ab-mono')}>
                  {field.href ? (
                    <a
                      className='ab-link'
                      href={field.href}
                      rel='noopener'
                      target='_blank'
                    >
                      {field.value}
                    </a>
                  ) : (
                    field.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </Section>
      ) : null}
      {info.fills && info.fills.items.length > 0 ? (
        <Section
          action={
            <span className='ab-mono font-normal text-(--faint)'>
              {info.fills.label}
            </span>
          }
          title='Fills'
        >
          <ul className='grid grid-cols-[minmax(0,1fr)] gap-1'>
            {info.fills.items.map((item) => (
              <li className='ab-field' key={item}>
                <span
                  aria-hidden
                  className='size-3.5 flex-none rounded-[3px] shadow-[inset_0_0_0_1px_rgb(0_0_0/0.1)]'
                  style={{ background: tagSwatch(item) }}
                />
                <span className='min-w-0 flex-1 truncate'>{item}</span>
                <span className='ab-mono text-(--faint)'>100%</span>
                <Eye aria-hidden className='size-3 text-(--faint)' />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
      {info.exports && info.exports.length > 0 ? (
        <Section title='Export'>
          <ul className='grid grid-cols-[minmax(0,1fr)] gap-1'>
            {info.exports.map((item) => (
              <li className='min-w-0' key={item.href}>
                <a
                  className='ab-field group'
                  href={item.href}
                  rel={item.href.startsWith('/') ? undefined : 'noopener'}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                >
                  <span className='ab-field-key w-14'>{item.hint}</span>
                  <span className='min-w-0 flex-1 truncate'>{item.label}</span>
                  <ArrowUpRight
                    aria-hidden
                    className='size-3 text-(--faint) group-hover:text-(--sel)'
                  />
                </a>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </>
  )
}

function SelectionHeader({ selection }: { selection: Selection }) {
  const { info } = selection
  const Icon = layerIcons[info.type]
  return (
    <div className='ab-panel-section flex items-start gap-2'>
      <Icon
        aria-hidden
        className={cn(
          'mt-0.5 size-4 flex-none',
          info.type === 'component' ? 'text-(--component)' : 'text-(--muted)'
        )}
        strokeWidth={1.75}
      />
      <div className='min-w-0'>
        <p className='truncate font-semibold text-[13px] leading-5'>
          {info.name}
        </p>
        <p className='ab-t-label text-(--muted)'>{info.kind}</p>
      </div>
    </div>
  )
}

const colorTokens = [
  ['Canvas', '--canvas'],
  ['Artboard', '--board'],
  ['Text', '--ink'],
  ['Muted', '--muted'],
  ['Selection', '--sel'],
  ['Pen path', '--path'],
  ['Component', '--component'],
] as const

const textStyles = [
  ['Display', 56, 600],
  ['Title', 32, 600],
  ['Heading', 22, 600],
  ['Lead', 17, 400],
  ['Body', 15, 400],
  ['Small', 13, 400],
] as const

const themeLabel = (dark: boolean | null) => {
  if (dark === null) {
    return null
  }
  return dark ? 'Dark' : 'Light'
}

function PageStyles() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [dark, setDark] = useState<boolean | null>(null)

  // Read the live token values, and again whenever the theme class flips.
  useEffect(() => {
    const root = document.querySelector('.v-artboard')
    if (!root) {
      return
    }
    const read = () => {
      const s = getComputedStyle(root)
      setDark(document.documentElement.classList.contains('dark'))
      setValues(
        Object.fromEntries(
          colorTokens.map(([, token]) => [
            token,
            s.getPropertyValue(token).trim().toUpperCase(),
          ])
        )
      )
    }
    read()
    const observer = new MutationObserver(read)
    observer.observe(document.documentElement, {
      attributeFilter: ['class'],
      attributes: true,
    })
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Section
        action={
          <span className='ab-mono font-normal text-(--faint)'>
            {themeLabel(dark)}
          </span>
        }
        title='Color styles'
      >
        <ul className='grid gap-1'>
          {colorTokens.map(([name, token]) => (
            <li className='flex h-6 items-center gap-2 text-[11px]' key={name}>
              <span
                aria-hidden
                className='size-3.5 flex-none rounded-full shadow-[inset_0_0_0_1px_rgb(0_0_0/0.12)]'
                style={{ background: `var(${token})` }}
              />
              <span className='flex-1'>{name}</span>
              <span className='ab-mono text-(--faint)'>{values[token]}</span>
            </li>
          ))}
        </ul>
      </Section>
      <Section title='Text styles'>
        <ul className='grid gap-1'>
          {textStyles.map(([name, size, weight]) => (
            <li className='flex h-6 items-center gap-2 text-[11px]' key={name}>
              <span
                aria-hidden
                className='w-5 text-center text-[13px]'
                style={{ fontWeight: weight }}
              >
                Ag
              </span>
              <span className='flex-1'>{name}</span>
              <span className='ab-mono text-(--faint)'>Geist {size}</span>
            </li>
          ))}
        </ul>
      </Section>
    </>
  )
}

/** The right-hand Properties panel, with Design and Code tabs. */
export function PropertiesPanel() {
  const { selection, clear } = useWorkspace()
  const pathname = usePathname()
  const [tab, setTab] = useState<'code' | 'design'>('design')
  const onWork = pathname.endsWith('/work')
  const isText = selection?.info.type === 'text'

  return (
    <div className='flex min-h-full flex-col pb-28'>
      <div
        className='ab-panel-section flex items-center gap-1 py-2'
        role='tablist'
      >
        {(['design', 'code'] as const).map((t) => (
          <button
            aria-selected={tab === t}
            className={cn(
              'h-7 rounded px-2 font-semibold text-[11px] capitalize',
              tab === t
                ? 'bg-(--board) text-(--ink)'
                : 'text-(--muted) hover:text-(--ink)'
            )}
            key={t}
            onClick={() => setTab(t)}
            role='tab'
            type='button'
          >
            {t}
          </button>
        ))}
        <span className='ab-t-label ml-auto text-(--faint)'>100%</span>
      </div>

      {tab === 'code' ? (
        <div className='ab-panel-section'>
          {selection ? (
            <CodePreview info={selection.info} />
          ) : (
            <p className='ab-t-label text-(--muted)'>
              Select a layer to see its code.
            </p>
          )}
        </div>
      ) : null}

      {tab === 'design' && onWork ? (
        <Section
          action={
            <span className='ab-mono font-normal text-(--faint)'>Stack</span>
          }
          title='Filter'
        >
          <StackFilter className='-mx-1.5 max-h-64 overflow-y-auto' />
        </Section>
      ) : null}

      {tab === 'design' && selection ? (
        <>
          <SelectionHeader selection={selection} />
          <LayoutSection el={selection.el} />
          {isText ? <TypographySection el={selection.el} /> : null}
          <InfoSections info={selection.info} />
          <div className='ab-panel-section flex items-center gap-2 text-(--muted)'>
            <MousePointerClick aria-hidden className='size-3.5' />
            <p className='ab-t-label flex-1'>
              {selection.info.open
                ? 'Double-click to open'
                : 'Hold ⌥ to measure'}
            </p>
            <button
              className='ab-t-label rounded px-1 hover:text-(--ink)'
              onClick={clear}
              type='button'
            >
              Deselect
            </button>
          </div>
        </>
      ) : null}

      {tab === 'design' && !selection ? (
        <>
          <Section title='Page'>
            <div className='ab-field'>
              <span
                aria-hidden
                className='size-3.5 rounded-[3px] shadow-[inset_0_0_0_1px_rgb(0_0_0/0.12)]'
                style={{ background: 'var(--canvas)' }}
              />
              <span className='ab-mono'>Canvas</span>
              <span className='ab-mono ml-auto text-(--faint)'>100%</span>
            </div>
            <p className='ab-t-label mt-2 text-(--muted)'>
              Click any card to inspect it.
            </p>
          </Section>
          <PageStyles />
        </>
      ) : null}
    </div>
  )
}
